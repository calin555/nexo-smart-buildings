import { FileCheck2, FileText, UserRound } from "lucide-react";

import { OfferUpload } from "@/app/(admin)/admin/projects/offer-upload";
import { prisma } from "@/lib/prisma";
import {
  buildingLabels,
  functionLabels,
  kitLabels,
  parseProjectRequest,
} from "@/modules/portal/project-request";

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium", timeStyle: "short" }).format(
    value,
  );
}

export default async function AdminProjectsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ client?: string }> }>) {
  const { client } = await searchParams;
  const projects = await prisma.project.findMany({
    where: client ? { createdById: client } : undefined,
    include: {
      organization: true,
      createdBy: true,
      documents: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="min-w-0 space-y-6">
      <section>
        <p className="eyebrow">Cereri clienți</p>
        <h1 className="mt-2 text-3xl font-semibold">Planuri și ofertare</h1>
        <p className="mt-2 text-slate">
          Planurile noi și cerințele selectate de clienți apar aici.
        </p>
      </section>
      <section className="grid gap-5">
        {projects.map((project) => {
          const request = parseProjectRequest(project.description);
          const plans = project.documents.filter(
            (document) =>
              document.documentType === "PLAN" && document.processingStatus === "UPLOADED",
          );
          const offers = project.documents.filter(
            (document) =>
              document.documentType === "OTHER" && document.processingStatus === "UPLOADED",
          );
          return (
            <article key={project.id} className="panel">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">{project.organization.legalName}</p>
                  <h2 className="mt-1 text-xl font-semibold">{project.name}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate">
                    <UserRound className="size-4" /> {project.createdBy.name} ·{" "}
                    {project.createdBy.email}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
                  {plans.length} planuri · {offers.length} oferte
                </span>
              </div>
              {request && (
                <div className="mt-5 grid gap-3 rounded-xl bg-cloud p-4 sm:grid-cols-2">
                  <p className="text-sm">
                    <span className="font-semibold">Clădire:</span>{" "}
                    {buildingLabels[request.buildingType]}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Kit:</span> {kitLabels[request.kit]}
                  </p>
                  <p className="text-sm sm:col-span-2">
                    <span className="font-semibold">Funcții:</span>{" "}
                    {request.functions.map((item) => functionLabels[item]).join(", ") ||
                      "Nespecificate"}
                  </p>
                  {request.notes && (
                    <p className="text-sm sm:col-span-2">
                      <span className="font-semibold">Detalii:</span> {request.notes}
                    </p>
                  )}
                </div>
              )}
              <div className="mt-5 grid gap-2">
                {plans.map((plan) => (
                  <p key={plan.id} className="flex items-center gap-2 text-sm">
                    <FileText className="size-4 text-emerald-700" />{" "}
                    <a
                      className="font-medium text-emerald-700 hover:underline"
                      href={`/api/admin/documents/${plan.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {plan.fileName}
                    </a>{" "}
                    · {formatDate(plan.createdAt)}
                  </p>
                ))}
                {offers.map((offer) => (
                  <p key={offer.id} className="flex items-center gap-2 text-sm">
                    <FileCheck2 className="size-4 text-electric" /> Ofertă publicată:{" "}
                    {offer.fileName}
                  </p>
                ))}
              </div>
              {plans.length > 0 && <OfferUpload projectId={project.id} />}
            </article>
          );
        })}
        {projects.length === 0 && (
          <div className="panel text-sm text-slate">Nu există încă planuri trimise de clienți.</div>
        )}
      </section>
    </main>
  );
}
