import { expect, test } from "@playwright/test";

test("pagina Kituri afișează cele nouă pachete orientative", async ({ page }) => {
  await page.goto("/kituri");

  await expect(
    page.getByRole("heading", { name: "Alege punctul de plecare potrivit clădirii tale." }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kit Smart Start" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kit Hotel Smart" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Configurează kitul/ })).toHaveCount(9);
  await expect(page.getByRole("link", { name: /Încarcă planul/ })).toHaveCount(10);
  await expect(page.getByText("990 € – 2.490 €", { exact: true })).toBeVisible();
  await expect(page.getByText("25.000 € – 150.000 €", { exact: true })).toBeVisible();
});

test("CTA-urile configuratorului public deschid fluxurile securizate din portal", async ({
  page,
}) => {
  await page.goto("/configurator-pe-plan");
  await page.getByRole("link", { name: "Configurează pe plan" }).click();
  await expect(page).toHaveURL(/\/login\?next=/);
  await expect(page.locator('input[name="next"]').first()).toHaveValue(
    "/portal#incarca-planul",
  );

  await page.goto("/configurator-pe-plan");
  await page
    .getByRole("complementary")
    .getByRole("link", { name: /Solicită ofertă/ })
    .click();
  await expect(page).toHaveURL(/\/login\?next=/);
  await expect(page.locator('input[name="next"]').first()).toHaveValue("/portal");
});

test("Kit Comfort actualizează live prețul și lista tehnică", async ({ page }) => {
  await page.goto("/configurator-kit?kit=casa-comfort");
  await expect(page.getByTestId("commercial-configurator")).toHaveAttribute("data-ready", "true");

  await expect(
    page.getByRole("heading", { level: 1, name: "Kit Casă Comfort", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("summary-price")).toContainText("3.420");
  await expect(page.getByTestId("product-count")).toHaveText("48");
  await expect(page.getByTestId("device-count")).toHaveText("62");
  await expect(page.getByText("2 actuatoare iluminat", { exact: true })).toBeVisible();
  await expect(page.getByText("9 senzori temperatură", { exact: true })).toBeVisible();
  await expect(page.getByText("12 întrerupătoare", { exact: true })).toBeVisible();

  const steps = page.getByRole("navigation", { name: "Pași configurator comercial" });
  await steps.getByRole("button", { name: /Iluminat/ }).click();
  const dimming = page.getByRole("checkbox", { name: /Dimming/ });
  await expect(dimming).toBeChecked();
  await page.getByText("Dimming", { exact: true }).click();
  await expect(dimming).not.toBeChecked();

  await expect(page.getByTestId("summary-price")).toContainText("3.330");
  await expect(page.getByTestId("product-count")).toHaveText("45");
  await expect(page.getByTestId("device-count")).toHaveText("56");
  await expect(page.getByText("1 actuator iluminat", { exact: true })).toBeVisible();
});

test("fiecare card deschide kitul ales", async ({ page }) => {
  await page.goto("/configurator-kit?kit=casa-premium-knx");

  await expect(
    page.getByRole("heading", { level: 1, name: "Kit Casă Premium KNX", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByTestId("commercial-configurator").getByRole("button", { name: /Solicită ofertă/ }),
  ).toBeVisible();
  await expect(
    page.getByText("Rezervă până la limita orientativă", { exact: false }),
  ).toBeVisible();
});

test("configurația anonimă este păstrată și continuă prin autentificare", async ({ page }) => {
  await page.goto("/configurator-kit?kit=securitate");
  await page.getByRole("button", { name: /Solicită ofertă/ }).click();

  await expect(page).toHaveURL(/\/login\?next=/);
  const pendingQuote = await page.evaluate(() =>
    window.localStorage.getItem("n3xo-pending-kit-quote"),
  );
  expect(pendingQuote).toBeTruthy();
  const parsed = JSON.parse(pendingQuote!) as {
    kitId: string;
    selectedOptionIds: string[];
  };
  expect(parsed.kitId).toBe("securitate");
  expect(parsed.selectedOptionIds).toEqual(
    expect.arrayContaining(["security-alarm", "security-smoke"]),
  );
  await expect(page.locator('input[name="next"]').first()).toHaveValue(
    "/configurator-kit?kit=securitate&submit=1",
  );
});

test("wizardul rămâne navigabil pe mobil și păstrează rezumatul", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/configurator-kit?kit=casa-comfort");
  await expect(page.getByTestId("commercial-configurator")).toHaveAttribute("data-ready", "true");

  await page.getByRole("button", { name: "2. Iluminat", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: "Iluminat", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Dimming", { exact: true })).toBeVisible();
  await expect(page.getByTestId("summary-price")).toContainText("3.420 €");
});

test("Kit Bloc Smart dimensionează scările și tipologiile de apartamente", async ({ page }) => {
  await page.goto("/configurator-kit?kit=bloc-smart");
  await expect(page.getByTestId("commercial-configurator")).toHaveAttribute("data-ready", "true");

  await expect(page.getByRole("heading", { name: "Clădire și apartamente" })).toBeVisible();
  await expect(page.getByText("24 apartamente", { exact: true })).toBeVisible();
  await expect(page.getByText("60 camere locuibile", { exact: true })).toBeVisible();
  await expect(page.getByTestId("product-count")).toHaveText("24");
  await expect(page.getByTestId("device-count")).toHaveText("60");

  await page.getByLabel("Apartamente cu 2 camere").fill("9");
  await expect(page.getByText("25 apartamente", { exact: true })).toBeVisible();
  await expect(page.getByText("62 camere locuibile", { exact: true })).toBeVisible();
  await expect(page.getByTestId("product-count")).toHaveText("25");
  await expect(page.getByTestId("summary-price")).toContainText("24.920");
});

test("Kit Pensiune Smart dimensionează tipurile de camere și spațiile comune", async ({ page }) => {
  await page.goto("/configurator-kit?kit=pensiune-smart");
  await expect(page.getByRole("heading", { name: "Camere și spații comune" })).toBeVisible();
  await expect(page.getByTestId("product-count")).toHaveText("13");
  await page.getByLabel("Camere standard").fill("12");
  await expect(page.getByTestId("product-count")).toHaveText("15");
});
