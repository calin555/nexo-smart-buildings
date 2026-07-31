import { expect, test, type Page } from "@playwright/test";
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
let documentId = "";
const uploadedStoragePaths: string[] = [];

test.skip(
  !process.env.E2E_SUPABASE_ENABLED || !process.env.E2E_PLAN_ANALYSIS_ENABLED,
  "Necesită Supabase E2E și providerul determinist de analiză.",
);
test.describe.configure({ mode: "serial" });
test.setTimeout(75_000);

async function login(page: Page, credentials: { email: string; password: string }): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(credentials.email);
  await page.getByLabel("Parolă").fill(credentials.password);
  await page.getByRole("button", { name: "Intră în cont" }).click();
  await expect(page).toHaveURL(/\/portal$/);
}

test.beforeAll(async () => {
  const profile = await prisma.profile.findUniqueOrThrow({
    where: { email: clientA.email },
    include: { memberships: { take: 1 } },
  });
  const membership = profile.memberships[0];
  if (!membership) throw new Error("Clientul A nu are organizație E2E.");
  const project = await prisma.project.create({
    data: {
      name: `E2E analiză plan ${Date.now()}`,
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

test("jobul asincron detectează o cameră cu confidence și cere confirmare", async ({ page }) => {
  await login(page, clientA);
  await page.goto(`/portal/configurator/${projectId}`);
  await page
    .getByLabel("Alege PDF, JPG sau PNG")
    .setInputFiles(path.resolve("public/images/projects/casa-inteligenta-cluj-technical.png"));
  const reservationPromise = page.waitForResponse(
    (response) =>
      response.url().endsWith(`/api/portal/projects/${projectId}/documents`) &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Încarcă planul" }).click();
  const reservation = await reservationPromise;
  expect(reservation.status()).toBe(201);
  const reserved = (await reservation.json()) as { documentId: string; storagePath: string };
  documentId = reserved.documentId;
  uploadedStoragePaths.push(reserved.storagePath);

  await expect(page.getByTestId("plan-overlay")).toBeVisible({ timeout: 30_000 });
  const startPromise = page.waitForResponse(
    (response) =>
      response
        .url()
        .endsWith(`/api/portal/projects/${projectId}/documents/${documentId}/analysis`) &&
      response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Analizează planul" }).click();
  expect((await startPromise).status()).toBe(202);

  await expect(page.getByText("Necesită confirmare", { exact: true })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole("button", { name: /Living detectat/ })).toBeVisible();
  await expect(page.getByText(/Detectat cu încredere ridicată · 92%/)).toBeVisible();
  await expect(page.getByTestId("summary-camere")).toContainText("1");
  await expect(page.getByTestId("summary-de-corectat")).toContainText("1");

  const confirmationPromise = page.waitForResponse(
    (response) =>
      response.url().includes(`/api/portal/projects/${projectId}/rooms/`) &&
      response.request().method() === "PATCH",
  );
  await page.getByRole("button", { name: "Confirmă camera" }).click();
  expect((await confirmationPromise).status()).toBe(200);
  await expect(page.getByText("Cameră confirmată", { exact: true })).toBeVisible();

  await expect
    .poll(async () => {
      const response = await page.request.get(
        `/api/portal/projects/${projectId}/documents/${documentId}/analysis`,
      );
      const payload = (await response.json()) as { status: string | null };
      return payload.status;
    })
    .toBe("COMPLETED");
});

test("clientul B nu poate citi statusul analizei organizației A", async ({ page }) => {
  await login(page, clientB);
  const response = await page.request.get(
    `/api/portal/projects/${projectId}/documents/${documentId}/analysis`,
  );
  expect(response.status()).toBe(403);
});
