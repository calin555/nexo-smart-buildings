import { CheckCircle2, CircleOff, Pencil, Plus } from "lucide-react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPrice(priceFrom: number): string {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format(priceFrom / 100);
}

export default async function ProductsPage({ searchParams }: Readonly<{ searchParams: Promise<{ created?: string; updated?: string }> }>) {
  const [products, notice] = await Promise.all([
    prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    searchParams,
  ]);

  return (
    <main className="min-w-0 space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Catalog</p><h1 className="mt-2 text-3xl font-semibold">Produse</h1><p className="mt-2 text-slate">Produsele active apar automat în secțiunea publică.</p></div>
        <Link href="/admin/products/new" className="button-primary"><Plus className="mr-2 size-4" />Adaugă produs</Link>
      </section>
      {(notice.created || notice.updated) && <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"><CheckCircle2 className="size-4" />{notice.created ? "Produsul a fost adăugat." : "Produsul a fost actualizat."}</div>}
      <section className="overflow-hidden rounded-2xl border border-slate/10 bg-white shadow-panel">
        {products.length === 0 ? <div className="p-10 text-center text-sm text-slate">Nu există produse. Adaugă primul produs din butonul de mai sus.</div> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b bg-cloud text-xs uppercase tracking-wider text-slate"><tr><th className="px-5 py-4">Produs</th><th className="px-5 py-4">Categorie</th><th className="px-5 py-4">Preț</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Acțiuni</th></tr></thead><tbody className="divide-y divide-slate/10">{products.map((product) => <tr key={product.id} className="hover:bg-cloud/60"><td className="px-5 py-4"><p className="font-medium text-ink">{product.name}</p><p className="mt-1 text-xs text-slate">{product.brand}</p></td><td className="px-5 py-4 text-slate">{product.category}</td><td className="px-5 py-4 font-medium">{formatPrice(product.priceFrom)}</td><td className="px-5 py-4">{product.active ? <span className="inline-flex items-center gap-1.5 text-emerald-700"><CheckCircle2 className="size-4" />Vizibil</span> : <span className="inline-flex items-center gap-1.5 text-slate"><CircleOff className="size-4" />Ascuns</span>}</td><td className="px-5 py-4 text-right"><Link href={`/admin/products/${product.id}/edit`} className="inline-flex items-center rounded-lg border px-3 py-2 font-medium hover:bg-cloud"><Pencil className="mr-2 size-4" />Editează</Link></td></tr>)}</tbody></table></div>
        )}
      </section>
    </main>
  );
}
