import { requireUser } from "@/lib/auth";

export default async function PortalPage() {
  const user = await requireUser();
  return (
    <main className="space-y-6">
      <section className="panel"><p className="eyebrow">Portal client</p><h1 className="mt-2 text-3xl font-semibold">Bun venit, {user.name}</h1><p className="mt-3 text-slate">Fundația MVP confirmă accesul tău izolat pe organizație.</p></section>
      <section className="panel"><h2 className="text-lg font-semibold">Organizațiile mele</h2><ul className="mt-4 space-y-2">{user.memberships.map((membership) => <li key={membership.organizationId} className="rounded-lg bg-cloud px-4 py-3"><span className="font-medium">{membership.organizationName}</span><span className="ml-2 text-sm text-slate">{membership.role}</span></li>)}</ul></section>
    </main>
  );
}
