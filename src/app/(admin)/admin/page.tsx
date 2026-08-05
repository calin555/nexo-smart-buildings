import { Building2, FileText, FolderKanban, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  await requireUser();
  const [organizations, profiles, projects, recentPlans] = await Promise.all([
    prisma.organization.count(),
    prisma.profile.count(),
    prisma.project.count({ where: { status: { not: "ARCHIVED" } } }),
    prisma.projectDocument.findMany({
      where: { documentType: "PLAN", processingStatus: "UPLOADED" },
      include: { project: { include: { organization: true } }, uploadedBy: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);
  return (
    <main className="space-y-6">
      <section>
        <p className="eyebrow">Administrare</p>
        <h1 className="mt-2 text-3xl font-semibold">Spațiu intern protejat</h1>
        <p className="mt-2 text-slate">
          Planurile încărcate de clienți și ofertele se gestionează de aici.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          [Building2, "Organizații", organizations],
          [Users, "Utilizatori", profiles],
          [FolderKanban, "Proiecte", projects],
          [FileText, "Planuri primite", recentPlans.length],
        ].map(([Icon, label, value]) => {
          const Glyph = Icon as typeof Users;
          return (
            <div key={label as string} className="panel">
              <Glyph className="text-emerald-600" />
              <p className="mt-5 text-sm text-slate">{label as string}</p>
              <p className="mt-1 text-2xl font-semibold">{value as number}</p>
            </div>
          );
        })}
      </section>
      <section className="panel">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Planuri primite recent</h2>
          <Link href={"/admin/projects" as Route} className="text-sm font-semibold text-emerald-700">
            Vezi toate și ofertează
          </Link>
        </div>
        <div className="mt-5 divide-y">
          {recentPlans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-wrap items-center justify-between gap-2 py-4 text-sm"
            >
              <div>
                <p className="font-medium">{plan.fileName}</p>
                <p className="mt-1 text-slate">
                  {plan.uploadedBy.name} · {plan.project.organization.legalName}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-800">
                Plan nou
              </span>
            </div>
          ))}
          {recentPlans.length === 0 && (
            <p className="py-5 text-sm text-slate">Nu există încă planuri trimise.</p>
          )}
        </div>
      </section>
    </main>
  );
}
