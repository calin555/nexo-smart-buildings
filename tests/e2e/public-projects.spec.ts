import { expect, test } from "@playwright/test";

test("homepage lists the three interactive project studies", async ({ page }) => {
  await page.goto("/#proiecte");

  await expect(
    page.getByRole("heading", { name: "Vezi ce se află în spatele automatizării." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explorează Bloc rezidențial inteligent, Cluj-Napoca" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explorează Casă inteligentă, Brașov" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explorează Casă inteligentă, Cluj-Napoca" }),
  ).toBeVisible();
});

test("Cluj residential project exposes the building systems", async ({ page }) => {
  await page.goto("/proiecte/bloc-rezidential-cluj");

  await expect(page.getByRole("heading", { name: /bloc rezidențial/i })).toBeVisible();
  await page.getByRole("button", { name: "Vezi detalii: Control acces rezidenți" }).click();

  await expect(page.getByRole("heading", { name: "Control acces rezidenți" })).toBeVisible();
  await expect(page.getByText("SIP / PoE / OSDP")).toBeVisible();
  await expect(page.getByText("ACC-01 · CAT6A · sursă 24 V cu backup")).toBeVisible();
});

test("Brașov house exposes climate and energy details", async ({ page }) => {
  await page.goto("/proiecte/casa-inteligenta-brasov");

  await expect(page.getByRole("heading", { name: /climatului de munte/i })).toBeVisible();
  await page.getByRole("button", { name: "Vezi detalii: Energie solară și baterie" }).click();

  await expect(page.getByRole("heading", { name: "Energie solară și baterie" })).toBeVisible();
  await expect(page.getByText("PV-01 · 10 kWp · baterie 12 kWh")).toBeVisible();
  await expect(
    page.getByText("Invertor hibrid, contor inteligent, pompă de căldură"),
  ).toBeVisible();
});

test("catalogul public găsește o referință Schneider și nu inventează prețul", async ({ page }) => {
  await page.goto("/?q=MTN6215-0410S#produse");

  await expect(page.getByRole("heading", { name: /MTN6215-0410S/ })).toBeVisible();
  await expect(page.getByText("Schneider Electric", { exact: true })).toBeVisible();
  await expect(page.getByText("Preț la cerere", { exact: true })).toBeVisible();
  await expect(page.getByText("342 produse")).not.toBeVisible();
});
