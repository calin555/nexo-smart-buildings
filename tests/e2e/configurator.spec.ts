import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import path from "node:path";

const prisma = new PrismaClient();
const clientA = {
  email: process.env.E2E_CLIENT_A_EMAIL!,
  password: process.env.E2E_CLIENT_A_PASSWORD!,
};
const clientB = {
  email: process.env.E2E_CLIENT_B_EMAIL!,
  password: process.env.E2E_CLIENT_B_PASSWORD!,
};

let projectId = "";
let clientAOrganizationId = "";
const uploadedStoragePaths: string[] = [];

test.skip(!process.env.E2E_SUPABASE_ENABLED, "Necesită infrastructură Supabase E2E.");
test.describe.configure({ mode: "serial" });
test.setTimeout(60_000);

async function login(page: Page, credentials: { email: string; password: string }): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(credentials.email);
  await page.getByLabel("Parolă").fill(credentials.password);
  await page.getByRole("button", { name: "Intră în cont" }).click();
  await expect(page).toHaveURL(/\/portal$/);
}

async function authenticatedRequest(page: Page): Promise<APIRequestContext> {
  await login(page, clientA);
  return page.request;
}

test.beforeAll(async () => {
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { email: clientA.email },
    include: { memberships: { take: 1 } },
  });
  const membership = profile.memberships[0];
  if (!membership) throw new Error("Clientul A nu are organizație E2E.");
  clientAOrganizationId = membership.organizationId;

  const project = await prisma.project.create({
    data: {
      name: `E2E configurator ${Date.now()}`,
      organizationId: membership.organizationId,
      createdById: profile.id,
    },
  });
  projectId = project.id;
});

test.afterAll(async () => {
  if (uploadedStoragePaths.length > 0) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && serviceRole) {
      const admin = createClient(url, serviceRole, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      await admin.storage.from("project-documents").remove(uploadedStoragePaths);
    }
  }
  if (projectId) await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.$disconnect();
});

test("anonimul este refuzat de configurator și de endpointul de upload", async ({ page }) => {
  await page.goto(`/portal/configurator/${projectId}`);
  await expect(page).toHaveURL(/\/login$/);

  const response = await page.request.post(`/api/portal/projects/${projectId}/documents`, {
    data: { fileName: "plan.png", mimeType: "image/png", fileSize: 1024 },
  });
  expect(response.status()).toBe(401);
});

test("uploadul validează MIME și dimensiunea pentru utilizatorul autentificat", async ({
  page,
}) => {
  const request = await authenticatedRequest(page);
  const invalidMime = await request.post(`/api/portal/projects/${projectId}/documents`, {
    data: { fileName: "plan.exe", mimeType: "application/octet-stream", fileSize: 1024 },
  });
  expect(invalidMime.status()).toBe(400);

  const tooLarge = await request.post(`/api/portal/projects/${projectId}/documents`, {
    data: { fileName: "plan.png", mimeType: "image/png", fileSize: 15_000_001 },
  });
  expect(tooLarge.status()).toBe(400);
});

test("clientul A încarcă planul, desenează și confirmă o cameră", async ({ page }) => {
  await login(page, clientA);
  await page.goto(`/portal/configurator/${projectId}`);
  await expect(page.getByRole("heading", { name: "Încarcă planul proiectului" })).toBeVisible();

  const filePath = path.resolve("public/images/projects/casa-inteligenta-cluj-technical.png");
  await page.getByLabel("Alege PDF, JPG sau PNG").setInputFiles(filePath);
  const reservationPromise = page.waitForResponse(
    (response) =>
      response.url().endsWith(`/api/portal/projects/${projectId}/documents`) &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Încarcă planul" }).click();
  const reservationResponse = await reservationPromise;
  expect(reservationResponse.status()).toBe(201);
  const reservation = (await reservationResponse.json()) as { storagePath: string };
  uploadedStoragePaths.push(reservation.storagePath);

  const overlay = page.getByTestId("plan-overlay");
  await expect(overlay).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Desenează cameră" }).click();
  const box = await overlay.boundingBox();
  if (!box) throw new Error("Planul nu are dimensiuni vizibile.");
  await overlay.click({ position: { x: box.width * 0.2, y: box.height * 0.2 } });
  await overlay.click({ position: { x: box.width * 0.55, y: box.height * 0.2 } });
  await overlay.click({ position: { x: box.width * 0.55, y: box.height * 0.55 } });
  await overlay.click({ position: { x: box.width * 0.2, y: box.height * 0.55 } });
  const roomResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith(`/api/portal/projects/${projectId}/rooms`) &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Închide camera" }).click();
  const roomResponse = await roomResponsePromise;
  expect(roomResponse.status()).toBe(201);

  await expect(page.getByLabel("Nume cameră")).toBeVisible();
  await page.getByLabel("Nume cameră").fill("Living E2E");
  await page.getByLabel("Tip").selectOption("LIVING");
  await page.getByLabel("Suprafață m²").fill("24.5");
  await page.getByLabel("Nivel").fill("Parter");
  await page.getByLabel("On/Off", { exact: true }).check();
  await page.getByRole("button", { name: "Confirmă camera" }).click();

  await expect(page.getByTestId("summary-camere")).toContainText("1");
  await expect(page.getByTestId("summary-confirmate")).toContainText("1");
  await expect(page.getByTestId("summary-circuite-lumină")).toContainText("1");

  await page.reload();
  await expect(page.getByRole("button", { name: /Living E2E/ })).toBeVisible();
  await expect(page.getByText("Cameră confirmată", { exact: true })).toBeVisible();

  const persisted = await prisma.projectRoom.findFirst({
    where: { projectId, organizationId: clientAOrganizationId, name: "Living E2E" },
    include: { geometries: { orderBy: { version: "desc" }, take: 1 }, features: true },
  });
  expect(persisted?.isConfirmed).toBe(true);
  const points = persisted?.geometries[0]?.normalizedPoints as Array<{ x: number; y: number }>;
  expect(points).toHaveLength(4);
  expect(
    points.every((point) => point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1),
  ).toBe(true);
  expect(persisted?.features.some((feature) => feature.featureCode === "LIGHTING_ON_OFF")).toBe(
    true,
  );
});

test("clientul B nu poate vedea sau modifica proiectul organizației A", async ({ page }) => {
  await login(page, clientB);
  const navigation = await page.goto(`/portal/configurator/${projectId}`);
  expect(navigation?.status()).toBe(404);

  const response = await page.request.post(`/api/portal/projects/${projectId}/documents`, {
    data: { fileName: "plan.png", mimeType: "image/png", fileSize: 1024 },
  });
  expect(response.status()).toBe(403);
});
