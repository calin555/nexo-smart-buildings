import { expect, test } from "@playwright/test";

test("homepage afișează brandurile ca legături interne", async ({ page }) => {
  await page.goto("/#branduri");
  await expect(
    page.getByRole("heading", { name: "Selectăm fiecare marcă după rolul din proiect." }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Logo ABB/ })).toHaveAttribute(
    "href",
    "/branduri/abb",
  );
  await expect(
    page.getByText(/nu existența automată a unui parteneriat oficial/).first(),
  ).toBeVisible();
});

test("pagina ABB explică rolul și proiectul demonstrativ", async ({ page }) => {
  await page.goto("/branduri/abb");
  await expect(page.getByRole("heading", { level: 1, name: "ABB" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "KNX permite proiecte multi-brand." }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Exemplu demonstrativ; nu reprezintă o afirmație despre un proiect real executat.",
    ),
  ).toBeVisible();
  await expect(page.getByText(/nu existența automată a unui parteneriat oficial/)).toBeVisible();
});

test("logo-ul dintr-un kit deschide rolul și soluția completă", async ({ page }) => {
  await page.goto("/kituri");
  const kit = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Kit Casă Comfort" }) });
  await kit.locator('summary[aria-label="Rolul ABB în Kit Casă Comfort"]').click();
  await expect(kit.getByRole("link", { name: "Vezi soluția completă" }).first()).toHaveAttribute(
    "href",
    "/branduri/abb",
  );
});
