import { expect, test, type Page } from "@playwright/test";

const demoPassword = "DemoPass!2026";
test.skip(!process.env.E2E_SUPABASE_ENABLED, "Necesită un proiect Supabase de test și conturi autentificate.");

async function login(page: Page, email: string): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Parolă").fill(demoPassword);
  await page.getByRole("button", { name: "Intră în cont" }).click();
}

test("un vizitator neautentificat este redirecționat de la portal", async ({ page }) => {
  await page.goto("/portal");
  await expect(page).toHaveURL(/\/login$/);
});

test("un client se poate autentifica și vede numai organizația proprie", async ({ page }) => {
  await login(page, "client@nexo.demo");
  await expect(page).toHaveURL(/\/portal$/);
  await expect(page.getByText("Persoană Fizică Demo")).toBeVisible();
  await expect(page.getByText("Clienți Demo SRL")).not.toBeVisible();
});

test("un client nu poate accesa administrarea", async ({ page }) => {
  await login(page, "client@nexo.demo");
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Nu aveți acces la această zonă." })).toBeVisible();
});

test("un super-administrator poate accesa administrarea", async ({ page }) => {
  await login(page, "superadmin@nexo.demo");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Spațiu intern protejat" })).toBeVisible();
});
