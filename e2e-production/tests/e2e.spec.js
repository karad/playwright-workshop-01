const { test, expect, chromium } = require("@playwright/test");

test("トップページにKANSOCK.INDUSTRIESという文言があるのを確認", async ({ page }) => {
  await page.goto("/ja");
  await expect(page.locator("main")).toContainText("KANSOCK.INDUSTRIES");
});

test("home lighthouse", async ({}, testInfo) => {
  // Chromium 以外ではスキップ
  if (testInfo.project.name !== "Chromium") {
    test.skip(true, "Lighthouse is Chromium only");
  }
  const { playAudit } = await import("playwright-lighthouse");
  const port = 9222;
  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${port}`],
  });
  const page = await browser.newPage();
  await page.goto("/ja");
  await playAudit({
    page,
    port,
    thresholds: {
      performance: 80,
      accessibility: 90,
      "best-practices": 85,
      seo: 80,
    },
    reports: {
      formats: { html: true, json: true },
      name: "home",
      directory: "lighthouse-reports",
    },
  });
  await browser.close();
});