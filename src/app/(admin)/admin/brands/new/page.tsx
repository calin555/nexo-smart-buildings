import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { createBrand } from "@/app/(admin)/admin/brands/actions";
import { BrandForm } from "@/app/(admin)/admin/brands/brand-form";

export default function NewBrandPage() {
  return (
    <main className="min-w-0 space-y-6">
      <section>
        <Link
          href="/admin/brands"
          className="inline-flex items-center text-sm font-medium text-slate hover:text-ink"
        >
          <ArrowLeft className="mr-2 size-4" />
          Înapoi la branduri
        </Link>
        <p className="eyebrow mt-6">Integrări</p>
        <h1 className="mt-2 text-3xl font-semibold">Adaugă brand</h1>
        <p className="mt-2 text-slate">
          Descrie rolul tehnic fără afirmații comerciale neverificate.
        </p>
      </section>
      <BrandForm action={createBrand} submitLabel="Adaugă brand" />
    </main>
  );
}
