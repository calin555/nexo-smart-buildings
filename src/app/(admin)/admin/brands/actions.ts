"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/rbac";
import { brandFormSchema } from "@/modules/brands/schema";

export type BrandActionState = { message?: string; errors?: Record<string, string[]> };

async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.memberships.some(({ role }) => adminRoles.has(role)) ? user : null;
}

function readBrandForm(formData: FormData) {
  return brandFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    logoUrl: formData.get("logoUrl"),
    description: formData.get("description"),
    usageCategories: formData.getAll("usageCategories"),
    level: formData.get("level"),
    kitIds: formData.getAll("kitIds"),
    sortOrder: formData.get("sortOrder"),
    active: formData.get("active") === "on",
    officialUrl: formData.get("officialUrl"),
    partnershipVerified: formData.get("partnershipVerified") === "on",
    verificationDocumentUrl: formData.get("verificationDocumentUrl"),
  });
}

function databaseError(error: unknown): BrandActionState {
  console.error(
    "Brand persistence failed",
    error instanceof Error ? error.message : "Unknown error",
  );
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
    return { message: "Există deja un brand cu acest slug." };
  return { message: "Brandul nu a putut fi salvat. Încearcă din nou." };
}

export async function createBrand(
  _state: BrandActionState,
  formData: FormData,
): Promise<BrandActionState> {
  const user = await requireAdmin();
  if (!user) return { message: "Nu ai permisiunea de a administra branduri." };
  const parsed = readBrandForm(formData);
  if (!parsed.success)
    return { message: "Verifică datele introduse.", errors: parsed.error.flatten().fieldErrors };
  let brandId: string;
  try {
    const brand = await prisma.$transaction(async (transaction) => {
      const created = await transaction.brand.create({
        data: {
          ...parsed.data,
          logoUrl: parsed.data.logoUrl || null,
          officialUrl: parsed.data.officialUrl || null,
          verificationDocumentUrl: parsed.data.verificationDocumentUrl || null,
        },
      });
      await transaction.auditLog.create({
        data: {
          actorId: user.id,
          action: "BRAND_CREATED",
          entityType: "Brand",
          entityId: created.id,
          metadata: { name: created.name, slug: created.slug },
        },
      });
      return created;
    });
    brandId = brand.id;
  } catch (error: unknown) {
    return databaseError(error);
  }
  revalidatePath("/");
  revalidatePath("/kituri");
  revalidatePath(`/branduri/${parsed.data.slug}`);
  revalidatePath("/admin/brands");
  redirect(`/admin/brands?created=${brandId}`);
}

export async function updateBrand(
  brandId: string,
  _state: BrandActionState,
  formData: FormData,
): Promise<BrandActionState> {
  const user = await requireAdmin();
  if (!user) return { message: "Nu ai permisiunea de a administra branduri." };
  const parsed = readBrandForm(formData);
  if (!parsed.success)
    return { message: "Verifică datele introduse.", errors: parsed.error.flatten().fieldErrors };
  try {
    await prisma.$transaction(async (transaction) => {
      const brand = await transaction.brand.update({
        where: { id: brandId },
        data: {
          ...parsed.data,
          logoUrl: parsed.data.logoUrl || null,
          officialUrl: parsed.data.officialUrl || null,
          verificationDocumentUrl: parsed.data.verificationDocumentUrl || null,
        },
      });
      await transaction.auditLog.create({
        data: {
          actorId: user.id,
          action: "BRAND_UPDATED",
          entityType: "Brand",
          entityId: brand.id,
          metadata: {
            name: brand.name,
            slug: brand.slug,
            partnershipVerified: brand.partnershipVerified,
          },
        },
      });
    });
  } catch (error: unknown) {
    return databaseError(error);
  }
  revalidatePath("/");
  revalidatePath("/kituri");
  revalidatePath(`/branduri/${parsed.data.slug}`);
  revalidatePath("/admin/brands");
  redirect(`/admin/brands?updated=${brandId}`);
}
