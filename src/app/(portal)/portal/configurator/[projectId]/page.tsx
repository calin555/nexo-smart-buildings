import { ArrowLeft, FilePlus2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ConfiguratorEditor } from "@/app/(portal)/portal/configurator/[projectId]/configurator-editor";
import { PlanUpload } from "@/app/(portal)/portal/configurator/[projectId]/plan-upload";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireProjectAccess } from "@/modules/configurator/access";
import { normalizedPolygonSchema } from "@/modules/configurator/schema";
import type {
  EditorAnalysisState,
  EditorRecommendationProduct,
  EditorRoom,
} from "@/modules/configurator/types";
import { isPlanAnalysisConfigured } from "@/modules/plan-analysis/registry";

export default async function ConfiguratorProjectPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ document?: string }>;
}>) {
  const user = await requireUser();
  const { projectId } = await params;
  const query = await searchParams;
  const project = await requireProjectAccess(user, projectId).catch(() => notFound());
  const documents = await prisma.projectDocument.findMany({
    where: { projectId: project.id, organizationId: project.organizationId },
    include: { pages: { orderBy: { pageNumber: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  const selectedDocument =
    documents.find((document) => document.id === query.document) ?? documents[0] ?? null;

  let signedUrl: string | null = null;
  let rooms: EditorRoom[] = [];
  let recommendationCatalog: EditorRecommendationProduct[] = [];
  let analysisState: EditorAnalysisState = {
    configured: isPlanAnalysisConfigured(),
    jobId: null,
    status: null,
    progress: 0,
    roomsDetected: 0,
    errorCode: null,
    errorMessage: null,
    issueCount: 0,
  };
  if (selectedDocument) {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.storage
      .from("project-documents")
      .createSignedUrl(selectedDocument.storagePath, 60 * 60);
    signedUrl = data?.signedUrl ?? null;

    const [databaseRooms, latestJob, catalogProducts] = await Promise.all([
      prisma.projectRoom.findMany({
        where: {
          projectId: project.id,
          organizationId: project.organizationId,
          documentPage: { documentId: selectedDocument.id },
        },
        include: {
          geometries: { orderBy: { version: "desc" }, take: 1 },
          features: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.analysisJob.findFirst({
        where: { documentId: selectedDocument.id },
        include: { _count: { select: { issues: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { active: true },
        select: {
          id: true,
          name: true,
          brand: true,
          category: true,
          badge: true,
          imageUrl: true,
          sortOrder: true,
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
    ]);
    recommendationCatalog = catalogProducts;
    rooms = databaseRooms.flatMap((room) => {
      const polygon = normalizedPolygonSchema.safeParse(room.geometries[0]?.normalizedPoints);
      if (!polygon.success) return [];
      return [
        {
          id: room.id,
          documentPageId: room.documentPageId,
          name: room.name,
          roomType: room.roomType,
          area: room.area === null ? null : Number(room.area),
          level: room.level,
          notes: room.notes,
          confidence: room.confidence,
          detectionStatus: room.detectionStatus,
          source: room.source,
          isConfirmed: room.isConfirmed,
          polygon: polygon.data,
          features: room.features.map((feature) => ({
            category: feature.category,
            featureCode: feature.featureCode,
            enabled: feature.enabled,
            quantity: feature.quantity,
          })),
        },
      ];
    });
    analysisState = {
      configured: isPlanAnalysisConfigured(),
      jobId: latestJob?.id ?? null,
      status: latestJob?.status ?? null,
      progress: latestJob?.progress ?? 0,
      roomsDetected: databaseRooms.filter((room) => room.source === "AI").length,
      errorCode: latestJob?.errorCode ?? null,
      errorMessage: latestJob?.errorMessage ?? null,
      issueCount: latestJob?._count.issues ?? 0,
    };
  }

  return (
    <main className="min-w-0">
      <Link
        href="/portal/configurator"
        className="inline-flex items-center text-sm font-medium text-slate hover:text-ink"
      >
        <ArrowLeft className="mr-2 size-4" /> Înapoi la proiecte
      </Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Configurator pe plan</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-.03em]">{project.name}</h1>
        </div>
        <span className="rounded-full border border-slate/15 bg-white px-3 py-1.5 text-xs text-slate">
          {documents.length} documente · {rooms.length} camere
        </span>
      </div>

      {selectedDocument && signedUrl ? (
        <>
          <div className="mt-6">
            <ConfiguratorEditor
              projectId={project.id}
              document={{
                id: selectedDocument.id,
                name: selectedDocument.fileName,
                mimeType: selectedDocument.mimeType,
                signedUrl,
              }}
              documents={documents.map((document) => ({
                id: document.id,
                name: document.fileName,
              }))}
              initialPages={selectedDocument.pages.map((page) => ({
                id: page.id,
                pageNumber: page.pageNumber,
              }))}
              initialRooms={rooms}
              initialAnalysis={analysisState}
              recommendationCatalog={recommendationCatalog}
            />
          </div>
          <details className="mt-6 rounded-xl border border-slate/15 bg-white p-4">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold">
              <FilePlus2 className="size-4 text-emerald-700" /> Încarcă încă un plan
            </summary>
            <div className="mt-4">
              <PlanUpload projectId={project.id} />
            </div>
          </details>
        </>
      ) : (
        <div className="mt-7">
          <PlanUpload projectId={project.id} />
        </div>
      )}
    </main>
  );
}
