export const productImageMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const productImageMaxBytes = 4_000_000;

export type ProductImageMimeType = (typeof productImageMimeTypes)[number];

export function isProductImageMimeType(value: string): value is ProductImageMimeType {
  return productImageMimeTypes.some((mimeType) => mimeType === value);
}

export function validateProductImageMetadata(
  metadata: Readonly<{ type: string; size: number }>,
): string | null {
  if (!isProductImageMimeType(metadata.type)) {
    return "Imaginea trebuie să fie JPG, PNG sau WebP.";
  }
  if (metadata.size <= 0) {
    return "Fișierul selectat este gol.";
  }
  if (metadata.size > productImageMaxBytes) {
    return "Imaginea nu poate depăși 4 MB.";
  }
  return null;
}
