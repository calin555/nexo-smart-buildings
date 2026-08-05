import { expect, test } from "@playwright/test";

test("Google Analytics se încarcă numai după consimțământ", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.removeItem("n3xo-analytics-consent"));
  await page.reload();

  const consentDialog = page.getByRole("dialog", { name: "Preferințe cookies" });
  await expect(consentDialog).toBeVisible();
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);

  await consentDialog.getByRole("button", { name: "Acceptă analiza" }).click();
  await expect(consentDialog).toBeHidden();
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveAttribute(
    "src",
    /G-W7L7YD6PYF/,
  );
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("n3xo-analytics-consent")))
    .toBe("granted");
});

test("refuzul păstrează Google Analytics dezactivat", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.removeItem("n3xo-analytics-consent"));
  await page.reload();

  await page.getByRole("button", { name: "Doar necesare" }).click();
  await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("n3xo-analytics-consent")))
    .toBe("denied");
});
