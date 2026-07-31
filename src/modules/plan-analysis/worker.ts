import "server-only";

import { Prisma } from "@prisma/client";

import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { verifyPlanBeforeAnalysis } from "@/modules/plan-analysis/file-security";
import { PlanAnalysisProviderError } from "@/modules/plan-analysis/openai-provider";
import { getPlanAnalysisProvider } from "@/modules/plan-analysis/registry";

export type AnalysisJobInput = {
  jobId: string;
  analysisId: string;
  documentId: string;
  projectId: string;
  organizationId: string;
  actorId: string;
  signedUrl: string;
  mimeType: string;
  fileSize: number;
};

function safeFailure(error: unknown): { code: string; message: string } {
  if (error instanceof PlanAnalysisProviderError) {
    return { code: error.code, message: error.message };
  }
  if (error instanceof Error) {
    const known: Record<string, string> = {
      UNSAFE_FILE_SIZE: "Fișierul depășește limita permisă.",
      FILE_UNAVAILABLE: "Fișierul nu a putut fi citit din storage.",
      INVALID_FILE_SIGNATURE: "Conținutul fișierului nu corespunde tipului declarat.",
      PLAN_ANALYSIS_NOT_CONFIGURED: "Furnizorul de analiză nu este configurat.",
    };
    const knownMessage = known[error.message];
    if (knownMessage) return { code: error.message, message: knownMessage };
  }
  return { code: "ANALYSIS_FAILED", message: "Planul nu a putut fi analizat. Poți relua jobul." };
}

export async function processPlanAnalysisJob(input: AnalysisJobInput): Promise<void> {
  const claim = await prisma.analysisJob.updateMany({
    where: { id: input.jobId, status: "QUEUED" },
    data: { status: "PROCESSING", progress: 10 },
  });
  if (claim.count !== 1) return;

  try {
    await prisma.$transaction([
      prisma.planAnalysis.update({
        where: { id: input.analysisId },
        data: { status: "PROCESSING", startedAt: new Date() },
      }),
      prisma.projectDocument.update({
        where: { id: input.documentId },
        data: { processingStatus: "PROCESSING" },
      }),
    ]);

    await verifyPlanBeforeAnalysis(input.signedUrl, input.mimeType, input.fileSize);
    await prisma.analysisJob.update({ where: { id: input.jobId }, data: { progress: 25 } });

    const provider = getPlanAnalysisProvider();
    const result = await provider.analyzeDocument({
      documentId: input.documentId,
      signedUrl: input.signedUrl,
      mimeType: input.mimeType,
    });
    await prisma.analysisJob.update({ where: { id: input.jobId }, data: { progress: 70 } });

    const roomsDetected = await prisma.$transaction(async (transaction) => {
      await transaction.projectRoom.deleteMany({
        where: {
          projectId: input.projectId,
          organizationId: input.organizationId,
          source: "AI",
          detectionStatus: "DETECTED",
          isConfirmed: false,
          documentPage: { documentId: input.documentId },
        },
      });

      let roomIndex = 0;
      for (const pageResult of result) {
        const page = await transaction.projectDocumentPage.upsert({
          where: {
            documentId_pageNumber: {
              documentId: input.documentId,
              pageNumber: pageResult.page,
            },
          },
          update: { width: pageResult.imageWidth, height: pageResult.imageHeight },
          create: {
            documentId: input.documentId,
            pageNumber: pageResult.page,
            width: pageResult.imageWidth,
            height: pageResult.imageHeight,
          },
        });

        for (const detected of pageResult.rooms) {
          roomIndex += 1;
          await transaction.projectRoom.create({
            data: {
              projectId: input.projectId,
              documentPageId: page.id,
              organizationId: input.organizationId,
              createdById: input.actorId,
              name: detected.detectedName ?? `Cameră detectată ${roomIndex}`,
              roomType: detected.roomType,
              detectedName: detected.detectedName,
              area: detected.detectedArea,
              detectedArea: detected.detectedArea,
              confidence: detected.confidence,
              detectionStatus: "DETECTED",
              source: "AI",
              isConfirmed: false,
              geometries: {
                create: {
                  geometryType: "POLYGON",
                  normalizedPoints: detected.polygon,
                },
              },
            },
          });
        }
      }

      if (roomIndex === 0) {
        await transaction.analysisIssue.create({
          data: {
            jobId: input.jobId,
            severity: "WARNING",
            code: "NO_ROOMS_DETECTED",
            message: "Nu au fost detectate camere. Poți desena camerele manual.",
          },
        });
      }

      await transaction.planAnalysis.update({
        where: { id: input.analysisId },
        data: {
          status: "NEEDS_REVIEW",
          rawResult: result as unknown as Prisma.InputJsonValue,
          completedAt: new Date(),
        },
      });
      await transaction.analysisJob.update({
        where: { id: input.jobId },
        data: { status: "NEEDS_REVIEW", progress: 100 },
      });
      await transaction.projectDocument.update({
        where: { id: input.documentId },
        data: { processingStatus: "NEEDS_REVIEW" },
      });
      return roomIndex;
    });

    await writeAuditLog({
      actorId: input.actorId,
      action: "PROJECT_PLAN_ANALYZED",
      entityType: "ProjectDocument",
      entityId: input.documentId,
      metadata: {
        organizationId: input.organizationId,
        provider: provider.providerName,
        modelVersion: provider.modelVersion,
        roomsDetected,
      },
    });
  } catch (error: unknown) {
    const failure = safeFailure(error);
    await prisma.$transaction([
      prisma.analysisJob.updateMany({
        where: { id: input.jobId },
        data: {
          status: "FAILED",
          errorCode: failure.code,
          errorMessage: failure.message,
        },
      }),
      prisma.planAnalysis.updateMany({
        where: { id: input.analysisId },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          errorMessage: failure.message,
        },
      }),
      prisma.projectDocument.updateMany({
        where: { id: input.documentId },
        data: { processingStatus: "FAILED" },
      }),
      prisma.analysisIssue.create({
        data: {
          jobId: input.jobId,
          severity: "ERROR",
          code: failure.code,
          message: failure.message,
        },
      }),
    ]);
  }
}
