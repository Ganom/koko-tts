import { defineStore } from "pinia";
import { computed, ref } from "vue";

// The companion site reads the streamer's *actual* runtime values from a
// `config.json` exported by the VoicePuppet app (mirrors how `voiceStore`
// reads `voices.json`). Everything here has a hardcoded fallback so a fork
// without an export (or a momentary fetch failure) still renders sane,
// real-world values instead of breaking. These fallbacks are a snapshot of a
// live export, so a degraded load shows correct values rather than guesses.

export type EffectPolicy = "AllLanes" | "RedeemOnly" | "Disabled";

export interface ModelOption {
  /** Tag a viewer types in a voice tag, e.g. `v3` in `[brian:v3]`. */
  tag: string;
  /** Human label shown in the builder, e.g. "Eleven v3". */
  label: string;
  /** Internal provider model id (never shown to viewers). */
  id?: string;
  /** Minimum bit value required, or the model is silently downgraded. */
  minBits: number;
}

export interface ResubTierBits {
  prime: number;
  "1": number;
  "2": number;
  "3": number;
}

export interface AppConfig {
  command: {
    maxLength: number;
    /** Max mid-message voice switches; segment cap is this + 1 (the base voice). */
    multiVoiceMaxSwitches: number;
  };
  activation: {
    redeemValue: number;
    v3MinimumBits: number;
    resubTierBits: ResubTierBits;
    allowCustomVoices: boolean;
  };
  models: ModelOption[];
  effects: {
    requestable: string[];
    policy: Record<string, EffectPolicy>;
  };
  sizeTokens: {
    enabled: boolean;
    small: string;
    big: string;
  };
  stage: {
    joinToken: string;
    joinBits: number;
    heckleBits: number;
    vipHeckleBits: number;
    heckleCharLimit: number;
    sessionSeconds: number;
    voteYay: string;
    voteBoo: string;
    /** Truthy when a channel-point redeem can also trigger a heckle. */
    heckleRedeemName?: string;
  };
  commands: {
    scoreLookup: boolean;
    scoreVotes: boolean;
    skipVotes: boolean;
  };
}

/** A deep-partial of the exported file; every level may be absent in a fork. */
export interface PartialAppConfig {
  command?: Partial<AppConfig["command"]>;
  activation?: Partial<Omit<AppConfig["activation"], "resubTierBits">> & {
    resubTierBits?: Partial<ResubTierBits>;
  };
  models?: ModelOption[];
  effects?: {
    requestable?: string[];
    policy?: Record<string, EffectPolicy>;
  };
  sizeTokens?: Partial<AppConfig["sizeTokens"]>;
  stage?: Partial<AppConfig["stage"]>;
  commands?: Partial<AppConfig["commands"]>;
}

export const FALLBACK_CONFIG: AppConfig = {
  command: {
    maxLength: 500,
    multiVoiceMaxSwitches: 2,
  },
  activation: {
    redeemValue: 500,
    v3MinimumBits: 300,
    resubTierBits: { prime: 500, "1": 500, "2": 1000, "3": 2500 },
    allowCustomVoices: true,
  },
  models: [
    { tag: "turbo", label: "Turbo v2", id: "eleven_turbo_v2", minBits: 0 },
    { tag: "turbov2.5", label: "Turbo v2.5", id: "eleven_turbo_v2_5", minBits: 0 },
    { tag: "flashv2", label: "Flash v2", id: "eleven_flash_v2", minBits: 0 },
    { tag: "flashv2.5", label: "Flash v2.5", id: "eleven_flash_v2_5", minBits: 0 },
    { tag: "v3", label: "Eleven v3", id: "eleven_v3", minBits: 300 },
    { tag: "multilingual", label: "Multilingual v2", id: "eleven_multilingual_v2", minBits: 0 },
    { tag: "english", label: "English v2", id: "eleven_english_v2", minBits: 0 },
  ],
  effects: {
    requestable: ["float", "glitch", "crt", "fire"],
    policy: { float: "AllLanes", glitch: "AllLanes", crt: "Disabled", fire: "AllLanes" },
  },
  sizeTokens: {
    enabled: true,
    small: "smol",
    big: "beeg",
  },
  stage: {
    joinToken: "!join",
    joinBits: 500,
    heckleBits: 100,
    vipHeckleBits: 1000,
    heckleCharLimit: 100,
    sessionSeconds: 150,
    voteYay: "Yay",
    voteBoo: "Boo",
    heckleRedeemName: "Highlight My Message",
  },
  commands: {
    scoreLookup: true,
    scoreVotes: true,
    skipVotes: true,
  },
};

/**
 * Merge a (possibly partial) exported config over the fallbacks. Nested objects
 * are merged a level deep so a fork that only overrides, say, `stage.joinBits`
 * keeps every other fallback value. Arrays (models, requestable effects) replace
 * wholesale; a streamer's exported list is authoritative when present.
 */
export function mergeConfig(base: AppConfig, override?: PartialAppConfig | null): AppConfig {
  if (!override) return base;

  return {
    command: { ...base.command, ...override.command },
    activation: {
      ...base.activation,
      ...override.activation,
      resubTierBits: {
        ...base.activation.resubTierBits,
        ...override.activation?.resubTierBits,
      },
    },
    models: override.models ?? base.models,
    effects: override.effects
      ? {
          requestable: override.effects.requestable ?? base.effects.requestable,
          policy: { ...base.effects.policy, ...override.effects.policy },
        }
      : base.effects,
    sizeTokens: { ...base.sizeTokens, ...override.sizeTokens },
    stage: { ...base.stage, ...override.stage },
    commands: { ...base.commands, ...override.commands },
  };
}

export const useConfigStore = defineStore("config", () => {
  // state
  const config = ref<AppConfig>(FALLBACK_CONFIG);
  const isLoaded = ref(false);

  // getters
  const maxCommandLength = computed(() => config.value.command.maxLength);
  /** Total voice segments allowed = base voice + the mid-message switches. */
  const maxSegments = computed(() => config.value.command.multiVoiceMaxSwitches + 1);

  const redeemValue = computed(() => config.value.activation.redeemValue);
  const resubTierBits = computed(() => config.value.activation.resubTierBits);
  const allowCustomVoices = computed(() => config.value.activation.allowCustomVoices);

  const models = computed(() => config.value.models);
  const effects = computed(() => config.value.effects);
  const sizeTokens = computed(() => config.value.sizeTokens);
  const stage = computed(() => config.value.stage);
  const commands = computed(() => config.value.commands);
  /** True when any chat-command family is enabled (controls the InfoBox section). */
  const hasChatCommands = computed(
    () => commands.value.scoreLookup || commands.value.scoreVotes || commands.value.skipVotes,
  );

  // actions
  const loadConfig = async (): Promise<void> => {
    if (isLoaded.value) return;

    try {
      const response = await fetch("/config.json");
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
      }

      const exported: PartialAppConfig = await response.json();
      config.value = mergeConfig(FALLBACK_CONFIG, exported);
    } catch (err) {
      // Never surface this to viewers. Fall back silently to the snapshot.
      console.error("Failed to load config, using fallbacks:", err);
      config.value = FALLBACK_CONFIG;
    } finally {
      isLoaded.value = true;
    }
  };

  return {
    config,
    isLoaded,
    maxCommandLength,
    maxSegments,
    redeemValue,
    resubTierBits,
    allowCustomVoices,
    models,
    effects,
    sizeTokens,
    stage,
    commands,
    hasChatCommands,
    loadConfig,
  };
});
