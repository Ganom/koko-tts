import { expect, test } from "@playwright/test";

test("stage stream route presents the command-first stage guide", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as Window & { __copiedText?: string }).__copiedText = text;
        },
      },
    });
  });

  await page.goto("/stage-stream");

  await expect(page.getByRole("heading", { name: "Stage How-To" })).toBeVisible();
  await expect(page.getByText("Stage stream participation guide", { exact: true })).toHaveCount(0);
  await expect(page.getByLabel("Stage mode thresholds")).toHaveCount(0);
  await expect(
    page.getByText("Cheer with !join in the same chat message to enter the stage queue.", {
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Drop a short message into the show without joining the stage queue.", {
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(
    page.getByText("While someone is on stage, vote with one exact chat word.", { exact: true }),
  ).toHaveCount(0);

  await expect(page.getByText("New to Koko TTS voices?")).toBeVisible();
  await expect(page.getByRole("link", { name: "Visit the main voices page" })).toHaveAttribute(
    "href",
    "/",
  );

  await expect(page.getByRole("heading", { name: "Get On Stage" })).toBeVisible();
  await expect(page.getByText("300+ bits", { exact: true })).toBeVisible();
  await expect(page.getByText("Cheer300 !join")).toBeVisible();
  const copyQueueCommand = page.getByRole("button", { name: "Copy queue command" });
  await expect(copyQueueCommand).toBeVisible();
  await copyQueueCommand.click();
  await expect(copyQueueCommand).toContainText("Copied");
  await expect
    .poll(() => page.evaluate(() => (window as Window & { __copiedText?: string }).__copiedText))
    .toBe("Cheer300 !join");

  await expect(page.getByRole("heading", { name: "Send a Heckle" })).toBeVisible();
  await expect(page.getByText("100+ bits", { exact: true })).toBeVisible();
  await expect(page.getByText("500+ bits", { exact: true })).toBeVisible();
  await expect(page.getByText("Cheer500 filthy fleepos")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy standard heckle" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy VIP dandy heckle" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Vote", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vote on the Performer" })).toHaveCount(0);
  await expect(page.getByText("Yay", { exact: true })).toBeVisible();
  await expect(page.getByText("Boo", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy vote command" })).toHaveCount(0);

  const copyYayVote = page.getByRole("button", { name: "Copy yay vote" });
  await expect(copyYayVote).toBeVisible();
  await copyYayVote.click();
  await expect
    .poll(() => page.evaluate(() => (window as Window & { __copiedText?: string }).__copiedText))
    .toBe("Yay");

  const copyBooVote = page.getByRole("button", { name: "Copy boo vote" });
  await expect(copyBooVote).toBeVisible();
  await copyBooVote.click();
  await expect
    .poll(() => page.evaluate(() => (window as Window & { __copiedText?: string }).__copiedText))
    .toBe("Boo");

  const lastHeckleRuleBox = await page
    .getByText("Keep it short because long heckles get trimmed.", { exact: true })
    .boundingBox();
  const importantCalloutBox = await page.getByText("Important", { exact: true }).boundingBox();
  expect(lastHeckleRuleBox).not.toBeNull();
  expect(importantCalloutBox).not.toBeNull();
  expect(
    importantCalloutBox!.y - (lastHeckleRuleBox!.y + lastHeckleRuleBox!.height),
  ).toBeGreaterThanOrEqual(24);

  const getOnStageCard = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Get On Stage" }) });
  const commandOffset = await getOnStageCard.evaluate((article) => {
    const commandLabel = [...article.querySelectorAll("p")].find(
      (element) => element.textContent?.trim() === "Queue command",
    );

    if (!commandLabel) {
      throw new Error("Queue command label not found");
    }

    return commandLabel.getBoundingClientRect().top - article.getBoundingClientRect().top;
  });
  expect(commandOffset).toBeLessThanOrEqual(120);

  const calloutBottoms = await page.locator("article").evaluateAll((articles) =>
    articles.map((article) => {
      const calloutTitle = [...article.querySelectorAll("p")].find((element) =>
        ["Keep the set tight", "Important", "Exact words only"].includes(
          element.textContent?.trim() ?? "",
        ),
      );

      if (!calloutTitle?.parentElement) {
        throw new Error("Card callout not found");
      }

      return calloutTitle.parentElement.getBoundingClientRect().bottom;
    }),
  );
  expect(Math.max(...calloutBottoms) - Math.min(...calloutBottoms)).toBeLessThanOrEqual(2);

  await expect(page.getByRole("img", { name: "Scooting emote" })).toBeVisible();
  await expect(page.getByRole("img", { name: "AAAA emote" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Yay emote" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Boo emote" })).toBeVisible();

  await expect(page.getByRole("link", { name: "Koko TTS Voices" })).toHaveAttribute("href", "/");
});
