import { expect, test } from "@playwright/test";

test("dev: no unstyled flash on first render", async ({ page }) => {
  await page.addInitScript(() => {
    const samples: Array<{
      t: number;
      hasH1: boolean;
      h1FontSize: number | null;
      bodyMarginTop: number | null;
    }> = [];

    // @ts-expect-error - test-only global
    window.__startupSamples = samples;

    let sawH1 = false;
    let framesAfterH1 = 0;
    const maxFrames = 600;

    const sample = () => {
      const h1 = document.querySelector("h1");
      const hasH1 = Boolean(h1);
      const h1FontSize = h1 ? parseFloat(getComputedStyle(h1).fontSize) : null;

      const body = document.body;
      const bodyMarginTop = body ? parseFloat(getComputedStyle(body).marginTop) : null;

      samples.push({
        t: performance.now(),
        hasH1,
        h1FontSize,
        bodyMarginTop,
      });

      if (hasH1) {
        sawH1 = true;
      }

      if (sawH1) {
        framesAfterH1 += 1;
      }

      if (samples.length < maxFrames && (!sawH1 || framesAfterH1 < 10)) {
        requestAnimationFrame(sample);
      }
    };

    requestAnimationFrame(sample);
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("h1");
  await page.waitForTimeout(250);

  const samples = await page.evaluate(() => {
    // @ts-expect-error - test-only global
    return window.__startupSamples as Array<{
      t: number;
      hasH1: boolean;
      h1FontSize: number | null;
      bodyMarginTop: number | null;
    }>;
  });

  const h1Samples = samples.filter((s) => s.hasH1);
  expect(h1Samples.length).toBeGreaterThan(0);

  // The very first frame where the header exists should already have Tailwind applied.
  const first = h1Samples[0];
  expect(first.h1FontSize).not.toBeNull();
  expect(first.h1FontSize).toBeGreaterThan(28);

  // No flash where the body reverts to default margins while content is visible.
  const badSamples = h1Samples.slice(0, 10).filter((s) => (s.bodyMarginTop ?? 0) > 0);
  expect(badSamples).toEqual([]);
});

