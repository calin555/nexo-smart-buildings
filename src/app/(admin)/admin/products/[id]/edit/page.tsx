import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProduct } from "@/app/(admin)/admin/products/actions";
import { ProductForm } from "@/app/(admin)/admin/products/product-form";
import { prisma } from "@/lib/prisma";

export default async function EditProductPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  const action = updateProduct.bind(null, product.id);

  return <main className="min-w-0 space-y-6"><section><Link href="/admin/products" className="inline-flex items-center text-sm font-medium text-slate hover:text-ink"><ArrowLeft className="mr-2 size-4" />Înapoi la produse</Link><p className="eyebrow mt-6">Catalog</p><h1 className="mt-2 text-3xl font-semibold">Editează produsul</h1><p className="mt-2 text-slate">Modificările produselor active apar pe site după salvare.</p></section><ProductForm action={action} submitLabel="Salvează modificările" defaults={{ name: product.name, brand: product.brand, category: product.category, description: product.description ?? "", priceLei: (product.priceFrom / 100).toFixed(2), badge: product.badge ?? "", imageUrl: product.imageUrl ?? "", illustration: product.illustration, sortOrder: product.sortOrder, active: product.active }} /></main>;
}
