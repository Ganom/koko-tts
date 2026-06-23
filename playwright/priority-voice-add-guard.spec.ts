import { expect, test } from "@playwright/test";

test("selecting a priority voice gates adding another voice behind a warning", async ({ page }) => {
  await page.goto("/");

  // Pick a priority voice in the first voice line.
  const search = page.getByPlaceholder("Search voices...");
  await search.waitFor();
  await search.fill("ultrasuperpremiumdandy");
  await page.locator(".voice-card button").first().click();

  // Adding another voice must warn first instead of silently adding a second line.
  await page.getByRole("button", { name: "Add a voice line" }).click();
  await expect(page.getByText(/priority spot/i)).toBeVisible();
  await expect(page.getByText("Voice 2")).toHaveCount(0);

  // The viewer can still proceed once warned.
  await page.getByRole("button", { name: "Add a voice anyway" }).click();
  await expect(page.getByText("Voice 2")).toBeVisible();
});
