import { describe, expect, it } from "vitest";
import {
  DEFAULT_POINTS_BUDGET,
  MAX_TTS_COMMAND_LENGTH,
  RESUB_TIER_BUDGETS,
  buildMultiVoiceCommand,
  buildTtsCommand,
  buildTtsPrefix,
  buildVoiceTag,
  getMaxMessageLengthForPrefix,
  getMinCheerAmount,
  getMultiVoiceCommandParts,
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

  it("appends size tokens to voice tags in any combination", () => {
    expect(buildVoiceTag({ voiceName: "Brian", size: "beeg" })).toBe("[brian:beeg]");
    expect(buildVoiceTag({ voiceName: "Brian", model: "v3", size: "beeg" })).toBe("[brian:v3:beeg]");
    expect(
      buildVoiceTag({ voiceName: "Brian", model: "v3", effect: "glitch", size: "smol" }),
    ).toBe("[brian:v3:glitch:smol]");
    expect(buildVoiceTag({ voiceName: "Brian", size: "none" })).toBe("[brian]");
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

  it("composes multi-voice messages (cheer keeps a single leading prefix)", () => {
    const segments = [
      { voiceName: "Ganom", text: "hi" },
      { voiceName: "Doc", text: "hello" },
      { voiceName: "Ganom", text: "bye" },
    ];

    expect(buildMultiVoiceCommand({ redeemMethod: "cheer", bitAmount: 500, segments })).toBe(
      "Cheer500 [ganom] hi [doc] hello [ganom] bye",
    );
    expect(buildMultiVoiceCommand({ redeemMethod: "points", bitAmount: 500, segments })).toBe(
      "[ganom] hi [doc] hello [ganom] bye",
    );
  });

  it("carries per-segment model/effect/size suffixes into the multi-voice command", () => {
    const command = buildMultiVoiceCommand({
      redeemMethod: "points",
      bitAmount: 500,
      segments: [
        { voiceName: "Brian", model: "v3", text: "intro" },
        { voiceName: "Dan", effect: "glitch", size: "beeg", text: "drop" },
      ],
    });

    expect(command).toBe("[brian:v3] intro [dan:glitch:beeg] drop");
  });

  it("skips voiceless segments and renders a trailing bare tag", () => {
    expect(
      getMultiVoiceCommandParts({
        redeemMethod: "cheer",
        bitAmount: 300,
        segments: [
          { voiceName: "Ganom", text: "hey" },
          { voiceName: "  ", text: "ignored" },
          { voiceName: "Doc", text: "" },
        ],
      }),
    ).toEqual([
      { type: "cheer", text: "Cheer300 " },
      { type: "voiceTag", text: "[ganom] " },
      { type: "message", text: "hey " },
      { type: "voiceTag", text: "[doc]" },
    ]);
  });

  it("returns no parts when no segment has a voice", () => {
    expect(
      getMultiVoiceCommandParts({
        redeemMethod: "points",
        bitAmount: 500,
        segments: [{ voiceName: "", text: "nope" }],
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
    expect(
      getRedeemBudget({
        redeemMethod: "resub",
        bitAmount: 123,
        resubTier: 2,
        resubBudgets: { 1: 500, 2: 1500, 3: 3000 },
      }),
    ).toBe(1500);

    expect(getMinCheerAmount({ storeMinCost: 300, selectedVoiceCost: 1000 })).toBe(1000);
    expect(getMinCheerAmount({ storeMinCost: 300, selectedVoiceCost: 0 })).toBe(300);
  });

  it("computes max message length from prefix length", () => {
    expect(getMaxMessageLengthForPrefix("x".repeat(10))).toBe(MAX_TTS_COMMAND_LENGTH - 10);
    expect(getMaxMessageLengthForPrefix("x".repeat(MAX_TTS_COMMAND_LENGTH))).toBe(0);
    expect(getMaxMessageLengthForPrefix("x".repeat(MAX_TTS_COMMAND_LENGTH + 1))).toBe(0);
  });
});

