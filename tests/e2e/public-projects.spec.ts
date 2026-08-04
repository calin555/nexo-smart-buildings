import { expect, test } from "@playwright/test";

test("homepage lists the three interactive project studies", async ({ page }) => {
  await page.goto("/#proiecte");

  await expect(
    page.getByRole("heading", { name: "Vezi ce se află în spatele automatizării." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Deschide proiectul Bloc rezidențial inteligent, Cluj-Napoca" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Deschide proiectul Casă inteligentă, Brașov" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Deschide proiectul Casă inteligentă, Cluj-Napoca" }),
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

test("homepage-ul public prezintă soluții și nu mai expune magazinul", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Configurează sistemul smart potrivit clădirii tale." }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Proiectare, echipamente, instalare, programare și mentenanță într-un singur proiect.",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Adaugă în coș|Cumpără acum|Vezi stocul/ }),
  ).toHaveCount(0);
  await expect(page.getByText("Filtrează după", { exact: false })).toHaveCount(0);
});

test("pagina unei soluții explică proiectul și conduce spre kit și plan", async ({ page }) => {
  await page.goto("/solutii/case-smart");
  await expect(page.getByRole("heading", { level: 1, name: /O casă care răspunde/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Vezi kiturile" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Încarcă planul" }).first()).toBeVisible();
  await expect(page.getByText("Produse", { exact: true })).toHaveCount(0);
});
