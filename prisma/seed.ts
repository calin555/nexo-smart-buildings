import { OrganizationType, ProductIllustration } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function upsertOrganization(type: OrganizationType, legalName: string, cui?: string) {
  return prisma.organization.upsert({
    where: { legalName },
    update: { type, cui },
    create: { type, legalName, cui },
  });
}

async function main(): Promise<void> {
  await Promise.all([
    upsertOrganization(OrganizationType.INTERNAL, "N3XO Smart Buildings (Demo)"),
    upsertOrganization(OrganizationType.INDIVIDUAL, "Persoană Fizică Demo"),
    upsertOrganization(OrganizationType.COMPANY, "Clienți Demo SRL", "RO12345678"),
  ]);
  await Promise.all(
    [
      "INDIVIDUAL_CLIENT",
      "COMPANY_CLIENT",
      "DEVELOPER",
      "DESIGNER",
      "INSTALLER",
      "SALES_AGENT",
      "ADMIN",
      "SUPER_ADMIN",
    ].map((code) =>
      prisma.role.upsert({
        where: { code },
        update: {},
        create: { code, label: code, scope: "organization" },
      }),
    ),
  );
  const demoProducts = [
    {
      slug: "kit-confort-apartament-2-camere",
      name: "Kit confort pentru apartament cu 2 camere",
      brand: "N3XO Home",
      priceFrom: 249000,
      category: "Kit-uri de automatizare",
      badge: "RECOMANDAT",
      illustration: ProductIllustration.KIT,
      sortOrder: 10,
    },
    {
      slug: "control-jaluzele-perdele",
      name: "Pachet de control pentru jaluzele și perdele",
      brand: "N3XO Home",
      priceFrom: 189000,
      category: "Întrerupătoare & umbrire",
      illustration: ProductIllustration.BLINDS,
      sortOrder: 20,
    },
    {
      slug: "termostat-senzor-prezenta",
      name: "Termostat inteligent cu senzor de prezență",
      brand: "N3XO Climate",
      priceFrom: 99000,
      category: "Confortul casei",
      illustration: ProductIllustration.CLIMATE,
      sortOrder: 30,
    },
    {
      slug: "acces-fara-cheie-locuinte",
      name: "Sistem de acces fără cheie pentru locuință",
      brand: "N3XO Secure",
      priceFrom: 134000,
      category: "Sisteme de securitate",
      badge: "NOU",
      illustration: ProductIllustration.LOCK,
      sortOrder: 40,
    },
    {
      slug: "monitorizare-consum-circuite",
      name: "Monitorizare consum electric pe circuite",
      brand: "N3XO Energy",
      priceFrom: 76000,
      category: "Energie & eficiență",
      illustration: ProductIllustration.ENERGY,
      sortOrder: 50,
    },
  ];
  await Promise.all(
    demoProducts.map((product) =>
      prisma.product.upsert({ where: { slug: product.slug }, update: product, create: product }),
    ),
  );
  console.log(
    "Roluri, organizații și produse demonstrative încărcate. Utilizatorii sunt creați exclusiv prin Supabase Auth.",
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
