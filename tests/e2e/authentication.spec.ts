import { expect, test, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

import { parseKitQuoteRequest } from "@/modules/commercial-configurator/quote-request";

const prisma = new PrismaClient();

const clientA = {
  email: process.env.E2E_CLIENT_A_EMAIL!,
  password: process.env.E2E_CLIENT_A_PASSWORD!,
};
const clientB = {
  email: process.env.E2E_CLIENT_B_EMAIL!,
  password: process.env.E2E_CLIENT_B_PASSWORD!,
};
const admin = { email: process.env.E2E_ADMIN_EMAIL!, password: process.env.E2E_ADMIN_PASSWORD! };
test.skip(!process.env.E2E_SUPABASE_ENABLED, "Necesită infrastructură Supabase E2E.");
test.describe.configure({ mode: "serial" });

let onboardingUserId = "";
let onboardingOrganizationId = "";
let quoteProjectId = "";

test.afterAll(async () => {
  if (quoteProjectId) {
    await prisma.auditLog.deleteMany({ where: { entityId: quoteProjectId } });
    await prisma.project.deleteMany({ where: { id: quoteProjectId } });
  }
  if (onboardingUserId) {
    await prisma.auditLog.deleteMany({ where: { actorId: onboardingUserId } });
    if (onboardingOrganizationId) {
      await prisma.organization.deleteMany({ where: { id: onboardingOrganizationId } });
    }

    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (serviceRole && supabaseUrl) {
      const adminClient = createClient(supabaseUrl, serviceRole, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      await adminClient.auth.admin.deleteUser(onboardingUserId);
    }
  }
  await prisma.$disconnect();
});

test("meniul public mobil se deschide și oferă navigarea principală", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-app-hydrated", "true");
  const menuButton = page.locator('summary[aria-label="Meniu principal"]');
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  await expect(page.getByRole("navigation", { name: "Navigare mobilă" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Case Smart", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Portal client" })).toBeVisible();
  await page.getByRole("link", { name: "Case Smart", exact: true }).click();
  await expect(page).toHaveURL(/\/solutii\/case-smart$/);
  await expect(page.getByRole("navigation", { name: "Navigare mobilă" })).toBeHidden();
});

test("meniul desktop se închide după alegerea unei tehnologii", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const technologyMenu = page
    .locator("details")
    .filter({ has: page.getByText("TEHNOLOGII", { exact: true }) });
  await technologyMenu.locator("summary").click();
  const securityLink = technologyMenu.getByRole("link", { name: "Securitate", exact: true });
  await expect(securityLink).toBeVisible();
  await securityLink.click();
  await expect(page).toHaveURL(/\/solutii\/securitate$/);
  await expect(technologyMenu).not.toHaveAttribute("open", "");
});

async function login(page: Page, credentials: { email: string; password: string }): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(credentials.email);
  await page.getByLabel("Parolă").fill(credentials.password);
  await page.getByRole("button", { name: "Intră în cont" }).click();
}
async function expectSession(page: Page): Promise<void> {
  const cookies = await page.context().cookies("http://localhost:3000");
  expect(
    cookies.some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token")),
  ).toBe(true);
}
test("anonimul este refuzat de portal", async ({ page }) => {
  await page.goto("/portal");
  await expect(page).toHaveURL(/\/login$/);
});
test("pagina de login afișează Google și inițiază redirectul OAuth", async ({ page, request }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Continuă cu Google" })).toBeVisible();

  const oauth = await request.get("/api/auth/google", { maxRedirects: 0 });
  expect([302, 307]).toContain(oauth.status());
  const location = oauth.headers().location;
  expect(location).toBeTruthy();
  const authorizeUrl = new URL(location!);
  expect(authorizeUrl.pathname).toBe("/auth/v1/authorize");
  expect(authorizeUrl.searchParams.get("provider")).toBe("google");
  expect(authorizeUrl.searchParams.get("redirect_to")).toContain("/auth/callback?next=%2Fportal");
});
test("client A se autentifică, păstrează sesiunea și nu accesează admin", async ({ page }) => {
  await login(page, clientA);
  await expect(page).toHaveURL(/\/portal$/);
  await expectSession(page);
  await expect(page.getByText("Persoană Fizică Demo")).toBeVisible();
  await page.reload();
  await expectSession(page);
  await expect(page.getByText("Persoană Fizică Demo")).toBeVisible();
  await page.goto("/");
  const accountMenu = page
    .locator("details")
    .filter({ has: page.locator('summary[aria-label^="Meniu cont"]') })
    .first();
  await accountMenu.locator("summary").click();
  await expect(accountMenu.getByRole("link", { name: "Portal client" })).toBeVisible();
  await expect(accountMenu.getByRole("link", { name: "Profilul meu" })).toBeVisible();
  await expect(accountMenu.getByRole("button", { name: "Deconectare" })).toBeVisible();
  await page.goto("/auth/callback?next=/portal");
  await expect(page).toHaveURL(/\/portal$/);
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Nu aveți acces la această zonă." }),
  ).toBeVisible();
});
test("configurația kitului este trimisă automat după login și ajunge la admin", async ({
  page,
}) => {
  await page.goto("/configurator-kit?kit=securitate");
  const steps = page.getByRole("navigation", { name: "Pași configurator comercial" });
  await steps.getByRole("button", { name: /Securitate/ }).click();
  await page.getByText("Camere video", { exact: true }).click();
  await page.getByRole("button", { name: /Solicită ofertă/ }).click();
  await expect(page).toHaveURL(/\/login\?next=/);

  await page.getByLabel("E-mail").fill(clientA.email);
  await page.getByLabel("Parolă").fill(clientA.password);
  await page.getByRole("button", { name: "Intră în cont" }).click();
  await expect(page).toHaveURL(/\/portal\?request=sent$/, { timeout: 20_000 });
  await expect(page.getByRole("paragraph").filter({ hasText: /^Kit Securitate$/ })).toBeVisible();
  expect(
    await page.evaluate(() => window.localStorage.getItem("n3xo-pending-kit-quote")),
  ).toBeNull();

  const profile = await prisma.profile.findUniqueOrThrow({ where: { email: clientA.email } });
  const project = await prisma.project.findFirstOrThrow({
    where: { createdById: profile.id, name: "Cerere ofertă · Kit Securitate" },
    orderBy: { createdAt: "desc" },
  });
  quoteProjectId = project.id;
  const request = parseKitQuoteRequest(project.description);
  expect(request?.selectedOptionIds).toContain("security-cameras");
  expect(request?.estimatedPrice).toBeGreaterThan(0);
});
test("utilizatorul nou finalizează onboardingul, organizația și membership-ul", async ({
  page,
}) => {
  test.skip(
    !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL,
    "Necesită service role numai pentru pregătirea utilizatorului temporar E2E.",
  );

  const email = `oauth-onboarding-${randomUUID()}@example.com`;
  const password = `E2E-${randomUUID()}-aA1!`;
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: "Utilizator OAuth temporar" },
  });
  expect(error).toBeNull();
  expect(data.user).toBeTruthy();
  onboardingUserId = data.user!.id;

  await login(page, { email, password });
  await expect(page).toHaveURL(/\/onboarding$/);
  await page.getByLabel("Nume complet").fill("Client Google E2E");
  await page.getByLabel("Telefon").fill("+40 721 000 999");
  await page.getByLabel("Tip client").selectOption("HOSPITALITY");
  await page.getByRole("button", { name: "Creează spațiul meu" }).click();
  await expect(page).toHaveURL(/\/portal$/);

  const membership = await prisma.membership.findFirstOrThrow({
    where: { profileId: onboardingUserId },
    include: { organization: true, profile: true },
  });
  onboardingOrganizationId = membership.organizationId;
  expect(membership.roleCode).toBe("COMPANY_CLIENT");
  expect(membership.profile.name).toBe("Client Google E2E");
  expect(membership.organization.type).toBe("COMPANY");
  expect(membership.organization.billingData).toMatchObject({
    phone: "+40 721 000 999",
    clientType: "HOSPITALITY",
  });

  await page.getByRole("button", { name: "Deconectare" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/portal");
  await expect(page).toHaveURL(/\/login$/);
});
test("client B vede numai organizația B", async ({ page }) => {
  await login(page, clientB);
  await expectSession(page);
  await expect(page.getByText("Clienți Demo SRL")).toBeVisible();
  await expect(page.getByText("Persoană Fizică Demo")).not.toBeVisible();
});
test("admin accesează administrarea echipamentelor și logout revocă sesiunea", async ({ page }) => {
  await login(page, admin);
  await expectSession(page);
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Spațiu intern protejat" })).toBeVisible();
  await page.goto("/portal");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("link", { name: "Clienți" })).toBeVisible();
  if (quoteProjectId) {
    await page.goto("/admin/projects");
    await expect(page.getByText("Cerere ofertă · Kit Securitate", { exact: true })).toBeVisible();
    await expect(page.getByText("Camere video", { exact: false })).toBeVisible();
  }
  await page.getByRole("link", { name: "Clienți" }).click();
  await expect(page.getByRole("heading", { name: "Clienți" })).toBeVisible();
  await page.goto("/admin/products");
  await expect(page.getByRole("heading", { name: "Echipamente" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Adaugă echipament" })).toBeVisible();
  await page.goto("/admin/brands");
  await expect(page.getByRole("heading", { name: "Branduri" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Adaugă brand" })).toBeVisible();
  await page.getByRole("button", { name: "Deconectare" }).click();
  await expect(page).toHaveURL(/\/$/);
  const cookies = await page.context().cookies("http://localhost:3000");
  expect(
    cookies.some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("auth-token")),
  ).toBe(false);
  await page.goto("/portal");
  await expect(page).toHaveURL(/\/login$/);
});
test("resetarea parolei și callback-ul nu expun o sesiune anonimă", async ({ page }) => {
  const reset = await page.request.post("/api/auth/reset-password", {
    form: { email: clientA.email },
    maxRedirects: 0,
  });
  expect(reset.status()).toBe(303);
  await page.goto("/auth/callback?next=/portal");
  await expect(page).toHaveURL(/\/login$/);
});
