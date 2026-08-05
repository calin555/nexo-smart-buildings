import { FileCheck2, FileClock, UploadCloud } from "lucide-react";
import { redirect } from "next/navigation";

import { PortalPlanUpload } from "@/app/(portal)/portal/portal-plan-upload";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/rbac";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { userOrganizationIds } from "@/modules/configurator/access";
import { kitDefinitions } from "@/modules/commercial-configurator/config";
import { parseKitQuoteRequest } from "@/modules/commercial-configurator/quote-request";

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(value);
}

export default async function PortalPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.memberships.some(({ role }) => adminRoles.has(role))) redirect("/admin");
  const projects = await prisma.project.findMany({
    where: { organizationId: { in: userOrganizationIds(user) } },
    include: {
      organization: true,
      documents: {
        where: { processingStatus: "UPLOADED" },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const offerDocuments = projects.flatMap((project) =>
    project.documents
      .filter((document) => document.documentType === "OTHER")
      .map((document) => ({ document, project })),
  );
  const supabase = await createServerSupabaseClient();
  const offers = await Promise.all(
    offerDocuments.map(async ({ document, project }) => {
      const { data } = await supabase.storage
        .from("project-documents")
        .createSignedUrl(document.storagePath, 60 * 10);
      return { document, project, url: data?.signedUrl ?? null };
    }),
  );
  const plans = projects.flatMap((project) =>
    project.documents
      .filter((document) => document.documentType === "PLAN")
      .map((document) => ({ document, project })),
  );
  const kitRequests = projects.flatMap((project) => {
    const request = parseKitQuoteRequest(project.description);
    return request ? [{ project, request }] : [];
  });

  return (
    <main className="min-w-0 space-y-7">
      <section>
        <p className="eyebrow">Portal client</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-.03em]">Bun venit, {user.name}</h1>
        <p className="mt-2 max-w-2xl text-slate">
          Încarcă planul clădirii. Echipa N3XO îl analizează și publică oferta aici.
        </p>
        <p className="mt-3 text-sm font-medium text-emerald-700">
          Cont: {user.memberships.map((membership) => membership.organizationName).join(" · ")}
        </p>
      </section>

      <PortalPlanUpload memberships={user.memberships} />

      <section id="status" className="grid gap-4 sm:grid-cols-2">
        <div className="panel">
          <FileClock className="size-5 text-emerald-700" />
          <p className="mt-5 text-sm text-slate">Planuri trimise</p>
          <p className="mt-1 text-2xl font-semibold">{plans.length}</p>
          <p className="mt-2 text-sm text-slate">
            {plans[0]
              ? `Ultimul plan: ${formatDate(plans[0].document.createdAt)}`
              : "Nu ai trimis încă niciun plan."}
          </p>
        </div>
        <div id="oferte" className="panel">
          <FileCheck2 className="size-5 text-electric" />
          <p className="mt-5 text-sm text-slate">Oferte primite</p>
          <p className="mt-1 text-2xl font-semibold">{offers.length}</p>
          <p className="mt-2 text-sm text-slate">
            {offers.length > 0
              ? "Oferta ta este disponibilă mai jos."
              : "Te anunțăm aici când oferta este gata."}
          </p>
        </div>
      </section>

      {kitRequests.length > 0 ? (
        <section className="panel">
          <p className="eyebrow">Cereri de ofertă</p>
          <h2 className="mt-2 text-xl font-semibold">Configurații trimise echipei N3XO</h2>
          <div className="mt-5 grid gap-3">
            {kitRequests.map(({ project, request }) => (
              <div
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate/15 px-4 py-4"
              >
                <div>
                  <p className="font-semibold">{kitDefinitions[request.kitId].name}</p>
                  <p className="mt-1 text-sm text-slate">
                    Trimisă {formatDate(project.createdAt)} · în analiză
                  </p>
                </div>
                <p className="font-semibold text-emerald-800">
                  Estimare {new Intl.NumberFormat("ro-RO").format(request.estimatedPrice)} €
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="panel">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <FileCheck2 className="size-5" />
          </span>
          <div>
            <p className="eyebrow">Ofertele tale</p>
            <h2 className="mt-1 text-xl font-semibold">Documente publicate de N3XO</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          {offers.map(({ document, project, url }) => (
            <div
              key={document.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate/15 px-4 py-4"
            >
              <div>
                <p className="font-semibold">{document.fileName}</p>
                <p className="mt-1 text-sm text-slate">
                  {project.name} · publicată {formatDate(document.createdAt)}
                </p>
              </div>
              {url && (
                <a className="button-primary" href={url} target="_blank" rel="noreferrer">
                  Deschide oferta
                </a>
              )}
            </div>
          ))}
          {offers.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate/20 bg-cloud px-5 py-8 text-center">
              <UploadCloud className="mx-auto size-6 text-slate" />
              <p className="mt-3 font-medium">Nu ai primit încă o ofertă.</p>
              <p className="mt-1 text-sm text-slate">
                După analiza planului sau a configurației, oferta va apărea automat aici.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="profil" className="panel scroll-mt-28">
        <p className="eyebrow">Profilul meu</p>
        <h2 className="mt-2 text-xl font-semibold">Datele contului</h2>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-cloud px-4 py-3">
            <dt className="text-slate">Nume</dt>
            <dd className="mt-1 font-semibold text-ink">{user.name}</dd>
          </div>
          <div className="rounded-xl bg-cloud px-4 py-3">
            <dt className="text-slate">E-mail</dt>
            <dd className="mt-1 font-semibold text-ink">{user.email}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
