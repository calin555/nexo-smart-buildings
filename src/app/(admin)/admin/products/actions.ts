"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/rbac";
import { productFormSchema } from "@/modules/products/schema";

export type ProductActionState = {
  message?: string;
  errors?: Record<string, string[]>;
};

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!user.memberships.some(({ role }) => adminRoles.has(role))) {
    return null;
  }
  return user;
}

function readProductForm(formData: FormData) {
  return productFormSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    category: formData.get("category"),
    description: formData.get("description"),
    priceLei: formData.get("priceLei"),
    badge: formData.get("badge"),
    imageUrl: formData.get("imageUrl"),
    illustration: formData.get("illustration"),
    sortOrder: formData.get("sortOrder"),
    active: formData.get("active") === "on",
  });
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

function databaseError(error: unknown): ProductActionState {
  console.error("Product persistence failed", error instanceof Error ? error.message : "Unknown error");
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { message: "Există deja un produs cu aceleași date unice." };
  }
  return { message: "Produsul nu a putut fi salvat. Încearcă din nou." };
}

export async function createProduct(_state: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const user = await requireAdmin();
  if (!user) return { message: "Nu ai permisiunea de a administra produse." };

  const parsed = readProductForm(formData);
  if (!parsed.success) return { message: "Verifică datele introduse.", errors: parsed.error.flatten().fieldErrors };

  const baseSlug = slugify(parsed.data.name) || "produs";
  const existing = await prisma.product.findUnique({ where: { slug: baseSlug }, select: { id: true } });
  const slug = existing ? `${baseSlug}-${crypto.randomUUID().slice(0, 8)}` : baseSlug;

  let productId: string;
  try {
    const product = await prisma.$transaction(async (transaction) => {
      const created = await transaction.product.create({
        data: {
          slug,
          name: parsed.data.name,
          brand: parsed.data.brand,
          category: parsed.data.category,
          description: parsed.data.description || null,
          priceFrom: Math.round(parsed.data.priceLei * 100),
          badge: parsed.data.badge || null,
          imageUrl: parsed.data.imageUrl || null,
          illustration: parsed.data.illustration,
          sortOrder: parsed.data.sortOrder,
          active: parsed.data.active,
        },
      });
      await transaction.auditLog.create({ data: { actorId: user.id, action: "PRODUCT_CREATED", entityType: "Product", entityId: created.id, metadata: { name: created.name } } });
      return created;
    });
    productId = product.id;
  } catch (error: unknown) {
    return databaseError(error);
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect(`/admin/products?created=${productId}`);
}

export async function updateProduct(productId: string, _state: ProductActionState, formData: FormData): Promise<ProductActionState> {
  const user = await requireAdmin();
  if (!user) return { message: "Nu ai permisiunea de a administra produse." };

  const parsed = readProductForm(formData);
  if (!parsed.success) return { message: "Verifică datele introduse.", errors: parsed.error.flatten().fieldErrors };

  try {
    await prisma.$transaction(async (transaction) => {
      const product = await transaction.product.update({
        where: { id: productId },
        data: {
          name: parsed.data.name,
          brand: parsed.data.brand,
          category: parsed.data.category,
          description: parsed.data.description || null,
          priceFrom: Math.round(parsed.data.priceLei * 100),
          badge: parsed.data.badge || null,
          imageUrl: parsed.data.imageUrl || null,
          illustration: parsed.data.illustration,
          sortOrder: parsed.data.sortOrder,
          active: parsed.data.active,
        },
      });
      await transaction.auditLog.create({ data: { actorId: user.id, action: "PRODUCT_UPDATED", entityType: "Product", entityId: product.id, metadata: { name: product.name } } });
    });
  } catch (error: unknown) {
    return databaseError(error);
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect(`/admin/products?updated=${productId}`);
}
