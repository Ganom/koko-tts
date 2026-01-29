import { expect, test } from "@playwright/test";

test("theme selector updates theme and persists", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("koko-tts-theme", "pink-gold");
  });

  await page.goto("/");

  await page.getByRole("button", { name: /Pink Gold/ }).click();
  await page.getByRole("button", { name: "Violet Pink" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "violet-pink");

  const storedTheme = await page.evaluate(() => localStorage.getItem("koko-tts-theme"));
  expect(storedTheme).toBe("violet-pink");
});

test("custom select updates the generated command", async ({ page }) => {
  await page.goto("/");

  const search = page.getByPlaceholder("Search voices...");
  await search.waitFor();
  await search.fill("aussie");

  await page.getByText("aussie", { exact: true }).first().click();
  await page.getByPlaceholder("Enter your message here...").fill("hello");

  const textEffectSection = page.locator("label", { hasText: "Text Effect" }).locator("..");
  await textEffectSection.getByRole("button").click();

  await page.getByText("Glitch", { exact: true }).click();
  await expect(page.getByText(/\[aussie:glitch\]/)).toBeVisible();
});

