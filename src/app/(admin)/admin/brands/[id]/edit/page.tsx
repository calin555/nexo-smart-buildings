import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateBrand } from "@/app/(admin)/admin/brands/actions";
import { BrandForm } from "@/app/(admin)/admin/brands/brand-form";
import { prisma } from "@/lib/prisma";

export default async function EditBrandPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) notFound();
  const action = updateBrand.bind(null, brand.id);
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
        <h1 className="mt-2 text-3xl font-semibold">Editează {brand.name}</h1>
        <p className="mt-2 text-slate">
          Actualizează prezentarea, kiturile și statutul verificării interne.
        </p>
      </section>
      <BrandForm
        action={action}
        submitLabel="Salvează modificările"
        defaults={{
          name: brand.name,
          slug: brand.slug,
          logoUrl: brand.logoUrl ?? "",
          description: brand.description,
          usageCategories: brand.usageCategories,
          level: brand.level,
          kitIds: brand.kitIds,
          sortOrder: brand.sortOrder,
          active: brand.active,
          officialUrl: brand.officialUrl ?? "",
          partnershipVerified: brand.partnershipVerified,
          verificationDocumentUrl: brand.verificationDocumentUrl ?? "",
        }}
      />
    </main>
  );
}
