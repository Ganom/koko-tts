import { expect, test } from "@playwright/test";

test("priority voices show a Priority badge with skip-queue tooltip", async ({ page }) => {
  await page.goto("/");

  const searchInput = page.getByPlaceholder("Search voices...");
  await searchInput.waitFor();

  await searchInput.fill("ultrasuperpremiumdandy");

  const badge = page.locator(".voice-carousel").getByText("Priority", { exact: true }).first();
  await expect(badge).toBeVisible();
  await expect(badge).toHaveAttribute("title", /redeem priority/i);
});
