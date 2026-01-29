import { expect, test } from "@playwright/test";

test("infobox can be hidden and persists", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem("koko-tts-hide-infobox");
  });

  await page.goto("/");

  const heading = page.getByRole("heading", { name: "Make Your Message Heard" });
  await expect(heading).toBeVisible();

  await page.getByRole("button", { name: "Hide instructions" }).click();
  await expect(heading).toHaveCount(0);

  await page.reload();

  await expect(page.getByRole("button", { name: "Show instructions" })).toBeVisible();
  await expect(heading).toHaveCount(0);

  await page.getByRole("button", { name: "Show instructions" }).click();
  await expect(heading).toBeVisible();
});

