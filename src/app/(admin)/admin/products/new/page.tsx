import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { createProduct } from "@/app/(admin)/admin/products/actions";
import { ProductForm } from "@/app/(admin)/admin/products/product-form";

export default function NewProductPage() {
  return <main className="min-w-0 space-y-6"><section><Link href="/admin/products" className="inline-flex items-center text-sm font-medium text-slate hover:text-ink"><ArrowLeft className="mr-2 size-4" />Înapoi la produse</Link><p className="eyebrow mt-6">Catalog</p><h1 className="mt-2 text-3xl font-semibold">Adaugă produs</h1><p className="mt-2 text-slate">Completează datele care vor fi afișate pe site.</p></section><ProductForm action={createProduct} submitLabel="Adaugă produs" /></main>;
}
