import { after } from "next/server";

import { writeAuditLog } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { AppError, errorResponse } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireProjectAccess } from "@/modules/configurator/access";
import {
  getPlanAnalysisProvider,
  isPlanAnalysisConfigured,
} from "@/modules/plan-analysis/registry";
import { processPlanAnalysisJob } from "@/modules/plan-analysis/worker";

export const maxDuration = 60;

type RouteContext = {
  params: Promise<{ projectId: string; documentId: string }>;
};

async function requireDocument(projectId: string, organizationId: string, documentId: string) {
  const document = await prisma.projectDocument.findFirst({
    where: { id: documentId, projectId, organizationId },
  });
  if (!document) throw new AppError("Documentul nu există.", 404, "DOCUMENT_NOT_FOUND");
  return document;
}

export async function GET(_request: Request, { params }: RouteContext): Promise<Response> {
  try {
    const user = await requireUser();
    const { projectId, documentId } = await params;
    const project = await requireProjectAccess(user, projectId);
    const document = await requireDocument(project.id, project.organizationId, documentId);
    const [job, roomsDetected] = await Promise.all([
      prisma.analysisJob.findFirst({
        where: { documentId: document.id },
        include: { _count: { select: { issues: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.projectRoom.count({
        where: {
          projectId: project.id,
          organizationId: project.organizationId,
          source: "AI",
          documentPage: { documentId: document.id },
        },
      }),
    ]);

    return Response.json({
      configured: isPlanAnalysisConfigured(),
      jobId: job?.id ?? null,
      status: job?.status ?? null,
      progress: job?.progress ?? 0,
      roomsDetected,
      errorCode: job?.errorCode ?? null,
      errorMessage: job?.errorMessage ?? null,
      issueCount: job?._count.issues ?? 0,
    });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}

export async function POST(_request: Request, { params }: RouteContext): Promise<Response> {
  try {
    const user = await requireUser();
    enforceRateLimit(`plan-analysis:${user.id}`, 4, 60 * 60 * 1000);
    const { projectId, documentId } = await params;
    const project = await requireProjectAccess(user, projectId);
    const document = await requireDocument(project.id, project.organizationId, documentId);
    if (!isPlanAnalysisConfigured()) {
      throw new AppError(
        "Analiza automată nu este configurată. Poți continua prin desenare manuală.",
        503,
        "PLAN_ANALYSIS_NOT_CONFIGURED",
      );
    }

    const latestJob = await prisma.analysisJob.findFirst({
      where: { documentId: document.id },
      orderBy: { createdAt: "desc" },
    });
    if (latestJob && ["QUEUED", "PROCESSING"].includes(latestJob.status)) {
      throw new AppError("Analiza acestui plan este deja în desfășurare.", 409, "ANALYSIS_ACTIVE");
    }
    if (latestJob && ["NEEDS_REVIEW", "COMPLETED"].includes(latestJob.status)) {
      throw new AppError(
        "Planul are deja detecții. Confirmă sau corectează camerele existente.",
        409,
        "ANALYSIS_ALREADY_AVAILABLE",
      );
    }

    const provider = getPlanAnalysisProvider();
    const supabase = await createServerSupabaseClient();
    const { data: signed, error: signedError } = await supabase.storage
      .from("project-documents")
      .createSignedUrl(document.storagePath, 10 * 60);
    if (signedError || !signed?.signedUrl) {
      throw new AppError("Planul nu poate fi citit din storage.", 422, "PLAN_UNAVAILABLE");
    }

    const result = await prisma.$transaction(async (transaction) => {
      const analysis = await transaction.planAnalysis.create({
        data: {
          documentId: document.id,
          provider: provider.providerName,
          modelVersion: provider.modelVersion,
          status: "QUEUED",
        },
      });
      const job = await transaction.analysisJob.create({
        data: {
          documentId: document.id,
          provider: provider.providerName,
          status: "QUEUED",
          progress: 0,
          retryCount: latestJob ? latestJob.retryCount + 1 : 0,
        },
      });
      await transaction.projectDocument.update({
        where: { id: document.id },
        data: { processingStatus: "QUEUED" },
      });
      return { analysis, job };
    });

    await writeAuditLog({
      actorId: user.id,
      action: latestJob ? "PROJECT_PLAN_ANALYSIS_RETRIED" : "PROJECT_PLAN_ANALYSIS_QUEUED",
      entityType: "AnalysisJob",
      entityId: result.job.id,
      metadata: {
        organizationId: project.organizationId,
        documentId: document.id,
        provider: provider.providerName,
      },
    });

    after(() =>
      processPlanAnalysisJob({
        jobId: result.job.id,
        analysisId: result.analysis.id,
        documentId: document.id,
        projectId: project.id,
        organizationId: project.organizationId,
        actorId: user.id,
        signedUrl: signed.signedUrl,
        mimeType: document.mimeType,
        fileSize: document.fileSize,
      }),
    );

    return Response.json(
      { jobId: result.job.id, status: result.job.status, progress: result.job.progress },
      { status: 202 },
    );
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
