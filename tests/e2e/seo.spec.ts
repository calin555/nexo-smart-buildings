import { expect, test } from "@playwright/test";

test("pagina pilon publică expune metadate, breadcrumbs și Schema.org", async ({ page }) => {
  const response = await page.goto("/casa-smart");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Casă smart și casă inteligentă: proiectare completă | N3XO");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Casă smart proiectată");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Configurează o casă smart/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/casa-smart$/);

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const schemaText = schemas.join(" ");
  expect(schemaText).toContain("BreadcrumbList");
  expect(schemaText).toContain("FAQPage");
  expect(schemaText).toContain("Service");
});

test("sitemapul și robots publică rutele indexabile și exclud autentificarea", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain("/automatizari-smart/cluj-napoca");
  expect(sitemapXml).toContain("/ghiduri/wifi-matter-sau-knx");
  expect(sitemapXml).not.toContain("/login");

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  const robotsText = await robots.text();
  expect(robotsText).toContain("Disallow: /admin/");
  expect(robotsText).toContain("Sitemap:");
});

test("varianta semantică veche redirecționează spre pagina pilon canonică", async ({ page }) => {
  await page.goto("/casa-inteligenta");
  await expect(page).toHaveURL(/\/casa-smart$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Casă smart proiectată");
});
