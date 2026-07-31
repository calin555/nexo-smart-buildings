import { AppError, errorResponse, ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { getCurrentUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { enforceRateLimit } from "@/lib/rate-limit";
import { adminRoles } from "@/lib/rbac";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { isProductImageMimeType, validateProductImageMetadata } from "@/modules/products/image";

const bucket = "product-images";
const extensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();
    if (!user.memberships.some(({ role }) => adminRoles.has(role))) {
      throw new ForbiddenError("Nu ai permisiunea de a încărca imagini de produs.");
    }

    enforceRateLimit(`product-image:${user.id}`, 12, 60_000);

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new AppError("Selectează o imagine.", 400, "IMAGE_REQUIRED");
    }

    const validationError = validateProductImageMetadata(file);
    if (validationError) {
      throw new AppError(validationError, 400, "INVALID_PRODUCT_IMAGE");
    }
    if (!isProductImageMimeType(file.type)) {
      throw new AppError("Tip de imagine invalid.", 400, "INVALID_PRODUCT_IMAGE");
    }

    const storage = createAdminSupabaseClient();
    const objectPath = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${extensions[file.type]}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error: uploadError } = await storage.storage.from(bucket).upload(objectPath, bytes, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      console.error("Product image upload failed", uploadError.message);
      throw new AppError("Imaginea nu a putut fi încărcată.", 502, "IMAGE_UPLOAD_FAILED");
    }

    try {
      await writeAuditLog({
        actorId: user.id,
        action: "PRODUCT_IMAGE_UPLOADED",
        entityType: "ProductImage",
        entityId: objectPath,
        metadata: { bucket, mimeType: file.type, size: file.size },
      });
    } catch (auditError: unknown) {
      await storage.storage.from(bucket).remove([objectPath]);
      throw auditError;
    }

    const { data } = storage.storage.from(bucket).getPublicUrl(objectPath);
    return Response.json({ url: data.publicUrl });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
