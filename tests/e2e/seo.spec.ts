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
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https?:\/\/[^/]+\/casa-smart$/,
  );

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
  expect(sitemapXml).toContain("/automatizari-case-cluj");
  expect(sitemapXml).toContain("/ghiduri/wifi-matter-sau-knx");
  expect(sitemapXml).not.toContain("/login");

  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  const robotsText = await robots.text();
  expect(robotsText).toContain("Disallow: /admin/");
  expect(robotsText).toContain("Disallow: /portal/");
  expect(robotsText).toContain("Disallow: /login");
  expect(robotsText).toContain("Sitemap:");
});

test("pagina locală Cluj și ghidul comparativ au conținut și scheme valide", async ({ page }) => {
  await page.goto("/automatizari-case-cluj");
  await expect(page).toHaveTitle("Automatizări case și sisteme KNX în Cluj-Napoca | N3XO");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByText("Florești, Apahida, Baciu")).toBeVisible();
  expect((await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ")).toContain(
    "ProfessionalService",
  );

  await page.goto("/ghiduri/wifi-matter-sau-knx");
  await expect(page.getByRole("table", { name: /Comparație între automatizările/ })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "KNX" })).toBeVisible();
  expect((await page.locator('script[type="application/ld+json"]').allTextContents()).join(" ")).toContain(
    "Article",
  );
});

test("varianta semantică veche redirecționează spre pagina pilon canonică", async ({ page }) => {
  await page.goto("/casa-inteligenta");
  await expect(page).toHaveURL(/\/casa-smart$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Casă smart proiectată");
});

test("toate URL-urile din sitemap au H1 unic și metadate indexabile", async ({ request }) => {
  test.skip(
    !process.env.SEO_FULL_CRAWL_ENABLED,
    "Auditul exhaustiv se rulează separat pentru a nu încărca suita E2E de autentificare.",
  );
  test.setTimeout(120_000);
  const sitemapResponse = await request.get("/sitemap.xml");
  const sitemapXml = await sitemapResponse.text();
  const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

  expect(urls.length).toBeGreaterThan(50);
  for (const url of urls) {
    if (!url) continue;
    const parsed = new URL(url);
    const response = await request.get(`${parsed.pathname}${parsed.search}`);
    expect(response.status(), url).toBe(200);
    const html = await response.text();
    expect((html.match(/<h1\b/gi) ?? []).length, `${url} trebuie să aibă un singur H1`).toBe(1);
    expect(html, `${url} nu are title`).toMatch(/<title>[^<]+<\/title>/i);
    expect(html, `${url} nu are meta description`).toMatch(
      /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["']/i,
    );
    expect(html, `${url} nu are canonical absolut`).toMatch(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']https?:\/\/[^"']+["']/i,
    );
    expect(html, `${url} nu trebuie să fie noindex`).not.toMatch(
      /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i,
    );
  }
});
