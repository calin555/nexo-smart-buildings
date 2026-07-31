import { ArrowRight, FileStack, Plus } from "lucide-react";
import Link from "next/link";

import { createConfiguratorProject } from "@/app/(portal)/portal/configurator/actions";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userOrganizationIds } from "@/modules/configurator/access";

export default async function ConfiguratorProjectsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ error?: string }> }>) {
  const user = await requireUser();
  const { error } = await searchParams;
  const projects = await prisma.project.findMany({
    where: { organizationId: { in: userOrganizationIds(user) } },
    include: { organization: true, _count: { select: { documents: true, rooms: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="min-w-0 space-y-7">
      <section>
        <p className="eyebrow">Configurator pe plan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-.03em]">Proiectele tale smart</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">
          Încarcă planul locuinței, desenează camerele și configurează funcțiile smart pe fiecare
          zonă.
        </p>
      </section>

      <section className="panel">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <Plus className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold">Proiect nou</h2>
            <p className="text-sm text-slate">
              Alege organizația care va deține planul și configurația.
            </p>
          </div>
        </div>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Verifică numele proiectului și organizația selectată.
          </p>
        )}
        <form
          action={createConfiguratorProject}
          className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
        >
          <input
            name="name"
            required
            minLength={3}
            maxLength={120}
            placeholder="Ex. Casa Familiei Pop"
            className="rounded-lg border border-slate/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
          />
          <select
            name="organizationId"
            required
            className="rounded-lg border border-slate/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
          >
            {user.memberships.map((membership) => (
              <option key={membership.organizationId} value={membership.organizationId}>
                {membership.organizationName}
              </option>
            ))}
          </select>
          <button type="submit" className="button-primary whitespace-nowrap">
            Creează proiect
          </button>
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Proiecte existente</h2>
          <span className="text-sm text-slate">{projects.length} proiecte</span>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/portal/configurator/${project.id}`}
              className="group rounded-2xl border border-slate/15 bg-white p-5 shadow-[0_8px_24px_rgba(15,35,28,.04)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_14px_30px_rgba(15,35,28,.08)]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-cloud text-emerald-700">
                  <FileStack className="size-5" />
                </span>
                <ArrowRight className="size-5 text-slate transition group-hover:translate-x-1 group-hover:text-emerald-700" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{project.name}</h3>
              <p className="mt-1 text-sm text-slate">{project.organization.legalName}</p>
              <div className="mt-5 flex gap-4 border-t border-slate/10 pt-4 text-xs text-slate">
                <span>{project._count.documents} planuri</span>
                <span>{project._count.rooms} camere</span>
                <span>{project.status}</span>
              </div>
            </Link>
          ))}
          {projects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate/20 bg-white px-6 py-10 text-center text-sm text-slate lg:col-span-2">
              Nu ai încă un proiect. Creează primul proiect folosind formularul de mai sus.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
