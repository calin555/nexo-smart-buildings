import { OrganizationType } from "@prisma/client";
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
    upsertOrganization(OrganizationType.INTERNAL, "NEXO Smart Buildings (Demo)"),
    upsertOrganization(OrganizationType.INDIVIDUAL, "Persoană Fizică Demo"),
    upsertOrganization(OrganizationType.COMPANY, "Clienți Demo SRL", "RO12345678"),
  ]);
  await Promise.all(["INDIVIDUAL_CLIENT", "COMPANY_CLIENT", "DEVELOPER", "DESIGNER", "INSTALLER", "SALES_AGENT", "ADMIN", "SUPER_ADMIN"].map((code) => prisma.role.upsert({ where: { code }, update: {}, create: { code, label: code, scope: "organization" } })));
  console.log("Roluri și organizații demonstrative încărcate. Utilizatorii sunt creați exclusiv prin Supabase Auth.");
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
