const { test, expect } = require("@playwright/test");

test("フォームからAPIに送信して結果が表示される", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Message").fill("hello");
  await page.getByRole("button", { name: "送信" }).click();

  await expect(page.locator("#result")).toContainText('"message": "hello"');
});

test("空送信はブロックされ入力にフォーカスが当たる", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#result")).toHaveText("(not sent)");

  await page.getByRole("button", { name: "送信" }).click();

  await expect(page.getByRole("textbox", { name: "Message" })).toBeFocused();
  await expect(page.locator("#message:invalid")).toHaveCount(1);
  await expect(page.locator("#result")).toHaveText("(not sent)");
});

test("Tab順が Message → 送信 になっている", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("heading", { name: "Playwright E2E Sample" }).click();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("textbox", { name: "Message" })).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "送信" })).toBeFocused();
});

test("送信中は (sending...) を表示してから結果が表示される", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    const origFetch = window.fetch.bind(window);
    window.fetch = (...args) =>
      new Promise((resolve, reject) =>
        setTimeout(() => origFetch(...args).then(resolve, reject), 800),
      );
  });

  await page.getByRole("textbox", { name: "Message" }).fill("delayed");
  await page.keyboard.press("Enter");

  await expect(page.locator("#result")).toHaveText("(sending...)");
  await expect(page.locator("#result")).toContainText('"message": "delayed"');
});

test("APIエラー時はエラーメッセージが表示される", async ({ page }) => {
  await page.goto("/");

  await page.evaluate(() => {
    window.fetch = async () => new Response("", { status: 500 });
  });

  await page.getByRole("textbox", { name: "Message" }).fill("will-fail");
  await page.keyboard.press("Enter");

  await expect(page.locator("#result")).toHaveText("Error: HTTP 500");
});
