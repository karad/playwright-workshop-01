const { test, expect } = require("@playwright/test");

test("フォームからAPIに送信して結果が表示される", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Message").fill("hello");
  await page.getByRole("button", { name: "送信" }).click();

  await expect(page.locator("#result")).toContainText('"message": "hello"');
});

