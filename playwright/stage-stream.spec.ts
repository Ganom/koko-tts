import { expect, test } from "@playwright/test";

test("stage stream route presents the participation guide", async ({ page }) => {
  await page.goto("/stage-stream");

  await expect(page.getByRole("heading", { name: "Stage How-To" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Get On Stage" })).toBeVisible();
  await expect(page.getByText("Cheer300 !join")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Send a Heckle" })).toBeVisible();
  await expect(page.getByText("Cheer500 filthy fleepos")).toBeVisible();

  await expect(page.getByRole("heading", { name: "Vote on the Performer" })).toBeVisible();
  await expect(page.getByText("Yay or Boo", { exact: true })).toBeVisible();

  await expect(page.getByRole("img", { name: "Scooting emote" })).toBeVisible();
  await expect(page.getByRole("img", { name: "AAAA emote" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Yay emote" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Boo emote" })).toBeVisible();

  await expect(page.getByRole("link", { name: "Koko TTS Voices" })).toHaveAttribute("href", "/");
});
