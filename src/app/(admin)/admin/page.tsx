import { Building2, FolderKanban, ShieldCheck, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
export default async function AdminPage() {
  const user = await requireUser();
  return (
    <main className="space-y-6">
      <section>
        <p className="eyebrow">Administrare</p>
        <h1 className="mt-2 text-3xl font-semibold">Spațiu intern protejat</h1>
        <p className="mt-2 text-slate">
          Bun venit, {user.name}. Privire de ansamblu asupra operațiunilor N3XO.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          [Building2, "Organizații", "18"],
          [Users, "Utilizatori", "42"],
          [FolderKanban, "Proiecte active", "12"],
          [ShieldCheck, "Audit", "0 alerte"],
        ].map(([Icon, label, value]) => {
          const Glyph = Icon as typeof Users;
          return (
            <div key={label as string} className="panel">
              <Glyph className="text-emerald-600" />
              <p className="mt-5 text-sm text-slate">{label as string}</p>
              <p className="mt-1 text-2xl font-semibold">{value as string}</p>
            </div>
          );
        })}
      </section>
      <section className="panel">
        <h2 className="text-lg font-semibold">Activitate recentă</h2>
        <div className="mt-5 divide-y">
          {[
            "Estimare actualizată · Casa Pădurii",
            "Document nou · Atria Residence",
            "Intervenție planificată · Nordic Hotel",
          ].map((item) => (
            <p key={item} className="py-4 text-sm text-slate">
              {item}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
