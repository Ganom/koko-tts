import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { FALLBACK_CONFIG, mergeConfig, useConfigStore } from "@/stores/configStore";

describe("mergeConfig", () => {
  it("returns the base config when there is no override", () => {
    expect(mergeConfig(FALLBACK_CONFIG, null)).toBe(FALLBACK_CONFIG);
    expect(mergeConfig(FALLBACK_CONFIG, undefined)).toBe(FALLBACK_CONFIG);
  });

  it("merges shallow scalar overrides while keeping untouched fallbacks", () => {
    const merged = mergeConfig(FALLBACK_CONFIG, {
      stage: { joinBits: 300, sessionSeconds: 180 },
    });

    expect(merged.stage.joinBits).toBe(300);
    expect(merged.stage.sessionSeconds).toBe(180);
    // Untouched stage fields fall back.
    expect(merged.stage.heckleCharLimit).toBe(FALLBACK_CONFIG.stage.heckleCharLimit);
    expect(merged.stage.voteYay).toBe("Yay");
    // The base config is never mutated.
    expect(FALLBACK_CONFIG.stage.joinBits).toBe(500);
  });

  it("merges resub tier bits a level deep", () => {
    const merged = mergeConfig(FALLBACK_CONFIG, {
      activation: { resubTierBits: { "2": 1500 } },
    });

    expect(merged.activation.resubTierBits["2"]).toBe(1500);
    expect(merged.activation.resubTierBits["1"]).toBe(500);
    expect(merged.activation.resubTierBits["3"]).toBe(2500);
  });

  it("merges effect policy but replaces the models array wholesale", () => {
    const merged = mergeConfig(FALLBACK_CONFIG, {
      effects: { policy: { crt: "AllLanes" } },
      models: [{ tag: "turbo", label: "Turbo v2", minBits: 0 }],
    });

    expect(merged.effects.policy.crt).toBe("AllLanes");
    expect(merged.effects.policy.float).toBe("AllLanes");
    expect(merged.effects.requestable).toEqual(FALLBACK_CONFIG.effects.requestable);
    expect(merged.models).toHaveLength(1);
  });
});

describe("configStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts from the fallback config", () => {
    const store = useConfigStore();
    expect(store.maxCommandLength).toBe(500);
    expect(store.redeemValue).toBe(500);
    expect(store.allowCustomVoices).toBe(true);
  });

  it("derives the segment cap as multiVoiceMaxSwitches + 1", () => {
    const store = useConfigStore();
    // Exported switches = 2 -> base voice + 2 switches = 3 voice tags.
    expect(store.config.command.multiVoiceMaxSwitches).toBe(2);
    expect(store.maxSegments).toBe(3);

    store.config.command.multiVoiceMaxSwitches = 9;
    expect(store.maxSegments).toBe(10);
  });

  it("reports whether any chat-command family is enabled", () => {
    const store = useConfigStore();
    expect(store.hasChatCommands).toBe(true);

    store.config.commands = { scoreLookup: false, scoreVotes: false, skipVotes: false };
    expect(store.hasChatCommands).toBe(false);

    store.config.commands = { scoreLookup: false, scoreVotes: true, skipVotes: false };
    expect(store.hasChatCommands).toBe(true);
  });
});
