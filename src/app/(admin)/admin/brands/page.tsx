import { CheckCircle2, CircleOff, Pencil, Plus } from "lucide-react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { levelLabel } from "@/modules/brands/data";

export const dynamic = "force-dynamic";

export default async function BrandsAdminPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ created?: string; updated?: string }> }>) {
  const [brands, notice] = await Promise.all([
    prisma.brand.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    searchParams,
  ]);
  return (
    <main className="min-w-0 space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Integrări</p>
          <h1 className="mt-2 text-3xl font-semibold">Branduri</h1>
          <p className="mt-2 text-slate">
            Gestionează prezentarea, rolurile tehnice și asocierea brandurilor cu kiturile.
          </p>
        </div>
        <Link href="/admin/brands/new" className="button-primary">
          <Plus className="mr-2 size-4" />
          Adaugă brand
        </Link>
      </section>
      {notice.created || notice.updated ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <CheckCircle2 className="size-4" />
          {notice.created ? "Brandul a fost adăugat." : "Brandul a fost actualizat."}
        </div>
      ) : null}
      <section className="overflow-hidden rounded-2xl border border-slate/10 bg-white shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-cloud text-xs uppercase tracking-wider text-slate">
              <tr>
                <th className="px-5 py-4">Brand</th>
                <th className="px-5 py-4">Nivel</th>
                <th className="px-5 py-4">Kituri</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-cloud/60">
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{brand.name}</p>
                    <p className="mt-1 text-xs text-slate">/branduri/{brand.slug}</p>
                  </td>
                  <td className="px-5 py-4">{levelLabel(brand.level)}</td>
                  <td className="px-5 py-4 text-slate">{brand.kitIds.length}</td>
                  <td className="px-5 py-4">
                    {brand.active ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700">
                        <CheckCircle2 className="size-4" />
                        Activ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate">
                        <CircleOff className="size-4" />
                        Inactiv
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/brands/${brand.id}/edit`}
                      className="inline-flex items-center rounded-lg border px-3 py-2 font-medium hover:bg-cloud"
                    >
                      <Pencil className="mr-2 size-4" />
                      Editează
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
