export const productCategories = [
  "Ecosisteme Smart Home",
  "Kit-uri de automatizare",
  "Confortul casei",
  "Iluminat inteligent",
  "Întrerupătoare & umbrire",
  "Prize / relee smart",
  "Sisteme de securitate",
  "Gateway-uri & telecomenzi",
  "Sisteme multimedia",
  "Accesorii & senzori",
] as const;

export type ProductCategory = (typeof productCategories)[number];
