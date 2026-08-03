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

test("catalogul public afișează produsul compact și deschide detaliile la click", async ({
  page,
}) => {
  await page.goto("/?q=MTN6215-0410S#produse");

  const productRow = page.getByRole("button", { name: /MTN6215-0410S/ });
  const dialog = page.getByRole("dialog");

  await expect(productRow).toBeVisible();
  await expect(dialog).toBeHidden();
  await productRow.click();

  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("MTN6215-0410S", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Preț la cerere", { exact: true })).toBeVisible();
  await expect(dialog.getByText(/catalogul Schneider Electric KNX 2025/)).toBeVisible();

  await dialog.getByRole("button", { name: "Închide detaliile produsului" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("342 produse")).not.toBeVisible();
});

test("catalogul ABB afișează fotografia oficială și detaliile tehnice la click", async ({
  page,
}) => {
  await page.goto("/?q=2CDG110030R0011#produse");

  const productRow = page.getByRole("button", { name: /2CDG110030R0011/ });
  await expect(productRow).toBeVisible();
  await expect(productRow.getByText("Intrare analogică", { exact: false })).toBeVisible();
  await expect(productRow.locator("img")).toHaveJSProperty("complete", true);
  expect(
    await productRow
      .locator("img")
      .evaluate((image) => (image instanceof HTMLImageElement ? image.naturalWidth : 0)),
  ).toBeGreaterThan(0);

  await productRow.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("2CDG110030R0011", { exact: true })).toBeVisible();
  await expect(dialog.getByText("ABB i-bus", { exact: true })).toBeVisible();
  await expect(dialog.getByText(/Cod comercial ABB: 2CDG110030R0011/)).toBeVisible();
  await expect(dialog.getByText("Preț la cerere", { exact: true })).toBeVisible();
});

test("selectarea unei categorii păstrează utilizatorul la începutul catalogului", async ({
  page,
}) => {
  await page.goto("/");

  const categories = page.getByRole("navigation", { name: "Categorii Smart Home" });
  await categories.getByRole("link", { name: /Kit-uri de automatizare/ }).click();

  await expect(page).toHaveURL(/category=Kit-uri(?:\+|%20)de(?:\+|%20)automatizare#catalog$/);
  await expect(page.locator("#catalog")).toBeInViewport();
  await expect(
    page.getByRole("heading", {
      name: "Control pentru lumină, climat, siguranță și energie.",
    }),
  ).toBeVisible();
});
