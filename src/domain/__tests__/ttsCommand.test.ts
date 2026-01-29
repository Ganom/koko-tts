import { describe, expect, it } from "vitest";
import {
  DEFAULT_POINTS_BUDGET,
  MAX_TTS_COMMAND_LENGTH,
  RESUB_TIER_BUDGETS,
  buildTtsCommand,
  buildTtsPrefix,
  buildVoiceTag,
  getMaxMessageLengthForPrefix,
  getMinCheerAmount,
  getRedeemBudget,
  getTtsCommandParts,
  isRandomVoiceName,
} from "@/domain/ttsCommand";

describe("ttsCommand", () => {
  it("detects random voice name", () => {
    expect(isRandomVoiceName("Random")).toBe(true);
    expect(isRandomVoiceName(" random ")).toBe(true);
    expect(isRandomVoiceName("RANDOM")).toBe(true);
    expect(isRandomVoiceName("rand0m")).toBe(false);
  });

  it("builds voice tags (lowercased + modifiers)", () => {
    expect(buildVoiceTag({ voiceName: "Koko" })).toBe("[koko]");
    expect(buildVoiceTag({ voiceName: "  Koko  " })).toBe("[koko]");
    expect(buildVoiceTag({ voiceName: "" })).toBe("");
    expect(buildVoiceTag({ voiceName: "Koko", model: "none" })).toBe("[koko]");
    expect(buildVoiceTag({ voiceName: "Koko", effect: "none" })).toBe("[koko]");
    expect(buildVoiceTag({ voiceName: "Koko", model: "v3" })).toBe("[koko:v3]");
    expect(buildVoiceTag({ voiceName: "Koko", effect: "glitch" })).toBe("[koko:glitch]");
    expect(buildVoiceTag({ voiceName: "Koko", model: "v3", effect: "glitch" })).toBe(
      "[koko:v3:glitch]",
    );
    expect(buildVoiceTag({ voiceName: "Koko", model: "  " })).toBe("[koko]");
  });

  it("builds prefixes", () => {
    expect(
      buildTtsPrefix({
        redeemMethod: "cheer",
        bitAmount: 500,
        voiceName: "Koko",
        model: "none",
        effect: "none",
      }),
    ).toBe("Cheer500 [koko] ");

    expect(
      buildTtsPrefix({
        redeemMethod: "points",
        bitAmount: 500,
        voiceName: "Koko",
        model: "v3",
        effect: "glitch",
      }),
    ).toBe("[koko:v3:glitch] ");

    expect(
      buildTtsPrefix({
        redeemMethod: "points",
        bitAmount: 500,
        voiceName: "  ",
        model: "v3",
        effect: "glitch",
      }),
    ).toBe("");
  });

  it("builds full commands", () => {
    expect(
      buildTtsCommand({
        redeemMethod: "cheer",
        bitAmount: 500,
        voiceName: "Koko",
        model: "none",
        effect: "none",
        message: "hello",
      }),
    ).toBe("Cheer500 [koko] hello");

    expect(
      buildTtsCommand({
        redeemMethod: "points",
        bitAmount: 999,
        voiceName: "Koko",
        model: "v3",
        effect: "glitch",
        message: "hello",
      }),
    ).toBe("[koko:v3:glitch] hello");

    expect(
      buildTtsCommand({
        redeemMethod: "points",
        bitAmount: 999,
        voiceName: "",
        model: "v3",
        effect: "glitch",
        message: "hello",
      }),
    ).toBe("");
  });

  it("builds command parts for display", () => {
    expect(
      getTtsCommandParts({
        redeemMethod: "cheer",
        bitAmount: 500,
        voiceName: "Koko",
        model: "none",
        effect: "none",
        message: "hello",
      }),
    ).toEqual([
      { type: "cheer", text: "Cheer500 " },
      { type: "voiceTag", text: "[koko] " },
      { type: "message", text: "hello" },
    ]);

    expect(
      getTtsCommandParts({
        redeemMethod: "points",
        bitAmount: 999,
        voiceName: "Koko",
        model: "v3",
        effect: "glitch",
        message: "hello",
      }),
    ).toEqual([
      { type: "voiceTag", text: "[koko:v3:glitch] " },
      { type: "message", text: "hello" },
    ]);

    expect(
      getTtsCommandParts({
        redeemMethod: "points",
        bitAmount: 999,
        voiceName: "",
        model: "v3",
        effect: "glitch",
        message: "hello",
      }),
    ).toEqual([]);
  });

  it("computes budgets and minimum cheer amounts", () => {
    expect(getRedeemBudget({ redeemMethod: "cheer", bitAmount: 123, resubTier: 1 })).toBe(123);
    expect(getRedeemBudget({ redeemMethod: "resub", bitAmount: 123, resubTier: 1 })).toBe(
      RESUB_TIER_BUDGETS[1],
    );
    expect(getRedeemBudget({ redeemMethod: "resub", bitAmount: 123, resubTier: 2 })).toBe(
      RESUB_TIER_BUDGETS[2],
    );
    expect(getRedeemBudget({ redeemMethod: "resub", bitAmount: 123, resubTier: 3 })).toBe(
      RESUB_TIER_BUDGETS[3],
    );
    expect(getRedeemBudget({ redeemMethod: "points", bitAmount: 123, resubTier: 1 })).toBe(
      DEFAULT_POINTS_BUDGET,
    );
    expect(
      getRedeemBudget({ redeemMethod: "points", bitAmount: 123, resubTier: 1, pointsBudget: 42 }),
    ).toBe(42);

    expect(getMinCheerAmount({ storeMinCost: 300, selectedVoiceCost: 1000 })).toBe(1000);
    expect(getMinCheerAmount({ storeMinCost: 300, selectedVoiceCost: 0 })).toBe(300);
  });

  it("computes max message length from prefix length", () => {
    expect(getMaxMessageLengthForPrefix("x".repeat(10))).toBe(MAX_TTS_COMMAND_LENGTH - 10);
    expect(getMaxMessageLengthForPrefix("x".repeat(MAX_TTS_COMMAND_LENGTH))).toBe(0);
    expect(getMaxMessageLengthForPrefix("x".repeat(MAX_TTS_COMMAND_LENGTH + 1))).toBe(0);
  });
});

