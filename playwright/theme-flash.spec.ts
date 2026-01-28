import { expect, test } from "@playwright/test";

test("no white flash before theme loads", async ({ page }) => {
  await page.addInitScript(() => {
    const samples: Array<{ bg: string; theme: string | null }> = [];
    // @ts-expect-error - test-only global
    window.__startupSamples = samples;

    const sample = () => {
      samples.push({
        bg: getComputedStyle(document.documentElement).backgroundColor,
        theme: document.documentElement.getAttribute("data-theme"),
      });

      if (samples.length < 30) {
        requestAnimationFrame(sample);
      }
    };

    requestAnimationFrame(sample);
  });

  await page.addInitScript(() => {
    localStorage.setItem("koko-tts-theme", "pink-gold");
  });

  await page.goto("/");
  await page.waitForTimeout(500);

  const samples = await page.evaluate(() => {
    // @ts-expect-error - test-only global
    return window.__startupSamples as Array<{ bg: string; theme: string | null }>;
  });

  expect(samples.length).toBeGreaterThan(0);

  const first = samples[0];
  expect(first.theme).toBe("pink-gold");

  const badBackgrounds = new Set(["rgb(255, 255, 255)", "rgba(0, 0, 0, 0)"]);
  const badSamples = samples.filter((s) => badBackgrounds.has(s.bg));
  expect(badSamples).toEqual([]);

  const wrongThemeSamples = samples.filter((s) => s.theme === "violet-pink");
  expect(wrongThemeSamples).toEqual([]);
});
