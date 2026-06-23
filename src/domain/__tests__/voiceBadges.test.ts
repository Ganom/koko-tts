import { describe, expect, it } from "vitest";
import type { Voice } from "@/types/voice";
import { NEW_VOICE_WINDOW_DAYS, isNewVoice, orderVoicesNewFirst } from "@/domain/voiceBadges";

const NOW = new Date("2026-06-23T12:00:00Z");

const voice = (name: string, cost: number, addedAt?: string): Voice => ({
  name,
  text: `This is ${name}.`,
  cost,
  ...(addedAt ? { addedAt } : {}),
});

describe("isNewVoice", () => {
  it("uses a 14-day window", () => {
    expect(NEW_VOICE_WINDOW_DAYS).toBe(14);
  });

  it("is not new when addedAt is absent", () => {
    expect(isNewVoice(undefined, NOW)).toBe(false);
  });

  it("is new inside the window", () => {
    expect(isNewVoice("2026-06-20T12:00:00Z", NOW)).toBe(true);
  });

  it("is new exactly on the 14-day boundary", () => {
    expect(isNewVoice("2026-06-09T12:00:00Z", NOW)).toBe(true);
  });

  it("is not new just past the window", () => {
    expect(isNewVoice("2026-06-09T11:59:00Z", NOW)).toBe(false);
  });

  it("is not new when future-dated", () => {
    expect(isNewVoice("2026-07-01T00:00:00Z", NOW)).toBe(false);
  });

  it("is not new when the string is malformed", () => {
    expect(isNewVoice("not-a-date", NOW)).toBe(false);
  });
});

describe("orderVoicesNewFirst", () => {
  it("puts new voices first (newest first), then cost desc, then name", () => {
    const voices = [
      voice("zed", 300, "2026-04-01T00:00:00Z"), // 80+ days old -> not new
      voice("alpha", 500), // no date -> not new
      voice("gamma", 100, "2026-06-23T11:00:00Z"), // newest
      voice("beta", 200, "2026-06-21T00:00:00Z"), // new, older than gamma
    ];

    const ordered = orderVoicesNewFirst(voices, NOW);

    expect(ordered.map((v) => v.name)).toEqual(["gamma", "beta", "alpha", "zed"]);
  });

  it("falls back to cost desc then name when nothing is new", () => {
    const voices = [voice("zed", 300), voice("alpha", 500), voice("gamma", 100)];

    const ordered = orderVoicesNewFirst(voices, NOW);

    expect(ordered.map((v) => v.name)).toEqual(["alpha", "zed", "gamma"]);
    expect(ordered).not.toBe(voices);
  });
});
