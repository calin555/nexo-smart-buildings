import { Building2, FileText, FolderKanban, UserRound } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("ro-RO", { dateStyle: "medium" }).format(value);
}

export default async function AdminClientsPage() {
  const clients = await prisma.profile.findMany({
    where: {
      memberships: {
        some: { roleCode: { notIn: ["ADMIN", "SUPER_ADMIN"] } },
        none: { roleCode: { in: ["ADMIN", "SUPER_ADMIN"] } },
      },
    },
    include: {
      memberships: {
        where: { roleCode: { notIn: ["ADMIN", "SUPER_ADMIN"] } },
        include: { organization: true },
        orderBy: { createdAt: "asc" },
      },
      createdProjects: {
        select: {
          id: true,
          documents: {
            where: { documentType: "PLAN", processingStatus: "UPLOADED" },
            select: { id: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-w-0 space-y-6">
      <section>
        <p className="eyebrow">Administrare clienți</p>
        <h1 className="mt-2 text-3xl font-semibold">Clienți</h1>
        <p className="mt-2 text-slate">
          Conturile client, organizațiile lor și numărul planurilor trimise.
        </p>
      </section>

      <section className="grid gap-4">
        {clients.map((client) => {
          const planCount = client.createdProjects.reduce(
            (total, project) => total + project.documents.length,
            0,
          );
          return (
            <article key={client.id} className="panel">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                    <UserRound className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-ink">{client.name}</h2>
                    <p className="mt-1 truncate text-sm text-slate">{client.email}</p>
                    <p className="mt-2 text-xs text-slate">
                      Client din {formatDate(client.createdAt)} · {client.status}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/projects?client=${client.id}` as Route}
                  className="rounded-lg border border-[#cbd8d2] px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:border-emerald-700"
                >
                  Vezi planurile
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-cloud px-4 py-3 text-sm">
                  <p className="flex items-center gap-2 text-slate">
                    <Building2 className="size-4" /> Organizații
                  </p>
                  <p className="mt-1 font-semibold">{client.memberships.length}</p>
                </div>
                <div className="rounded-xl bg-cloud px-4 py-3 text-sm">
                  <p className="flex items-center gap-2 text-slate">
                    <FolderKanban className="size-4" /> Proiecte
                  </p>
                  <p className="mt-1 font-semibold">{client.createdProjects.length}</p>
                </div>
                <div className="rounded-xl bg-cloud px-4 py-3 text-sm">
                  <p className="flex items-center gap-2 text-slate">
                    <FileText className="size-4" /> Planuri
                  </p>
                  <p className="mt-1 font-semibold">{planCount}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {client.memberships.map((membership) => (
                  <span
                    key={membership.id}
                    className="rounded-full border border-[#d8e2dd] bg-white px-3 py-1.5 text-xs text-ink"
                  >
                    {membership.organization.legalName} · {membership.roleCode}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
        {clients.length === 0 ? (
          <div className="panel text-sm text-slate">Nu există încă utilizatori client.</div>
        ) : null}
      </section>
    </main>
  );
}
