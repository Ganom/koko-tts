import { expect, test } from "@playwright/test";

test("random voice uses [random] and disables preview", async ({ page }) => {
  await page.goto("/");

  await page.getByPlaceholder("Search voices...").waitFor();

  const randomVoice = page.getByText("Random", { exact: true }).first();
  await expect(randomVoice).toBeVisible();
  await randomVoice.click();

  await expect(page.getByText("Preview:", { exact: true })).toHaveCount(0);

  await page.getByPlaceholder("Enter your message here...").fill("hello");

  await expect(page.getByText(/\[random\]/)).toBeVisible();
  await expect(page.getByText("hello")).toBeVisible();
});
