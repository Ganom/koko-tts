export const MAX_TTS_COMMAND_LENGTH = 500;

export type RedeemMethod = "cheer" | "points" | "resub";
export type ResubTier = 1 | 2 | 3;

export type VoiceModifier = string | null | undefined;

export interface TtsVoiceTagParams {
  voiceName: string;
  model?: VoiceModifier;
  effect?: VoiceModifier;
  size?: VoiceModifier;
}

export interface TtsCommandParams extends TtsVoiceTagParams {
  redeemMethod: RedeemMethod;
  bitAmount: number;
  message: string;
}

/** One voice run in a multi-voice message: a voice tag plus the text it speaks. */
export interface TtsSegment extends TtsVoiceTagParams {
  text?: string;
}

export interface TtsMultiCommandParams {
  redeemMethod: RedeemMethod;
  bitAmount: number;
  segments: TtsSegment[];
}

export type TtsCommandPartType = "cheer" | "voiceTag" | "message";
export interface TtsCommandPart {
  type: TtsCommandPartType;
  text: string;
}

export const RESUB_TIER_BUDGETS: Record<ResubTier, number> = {
  1: 500,
  2: 1000,
  3: 2500,
};

// Channel-point redeems auto-grant the streamer's redeem value (app default 500).
// Overridden at runtime by configStore.redeemValue; this is only the fallback.
export const DEFAULT_POINTS_BUDGET = 500;

function toModifierSuffix(value: VoiceModifier): string {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed || trimmed === "none") return "";
  return `:${trimmed}`;
}

export function isRandomVoiceName(name: string): boolean {
  return name.trim().toLowerCase() === "random";
}

export function buildVoiceTag({ voiceName, model, effect, size }: TtsVoiceTagParams): string {
  const trimmedName = voiceName.trim();
  if (!trimmedName) return "";

  const voice = trimmedName.toLowerCase();
  return `[${voice}${toModifierSuffix(model)}${toModifierSuffix(effect)}${toModifierSuffix(size)}]`;
}

export function buildTtsPrefix({
  redeemMethod,
  bitAmount,
  voiceName,
  model,
  effect,
}: Omit<TtsCommandParams, "message">): string {
  const voiceTag = buildVoiceTag({ voiceName, model, effect });
  if (!voiceTag) return "";

  const cheerPrefix = redeemMethod === "cheer" ? `Cheer${bitAmount} ` : "";
  return `${cheerPrefix}${voiceTag} `;
}

export function buildTtsCommand(params: TtsCommandParams): string {
  const prefix = buildTtsPrefix(params);
  if (!prefix) return "";

  const message = params.message;
  if (!message) return "";

  return `${prefix}${message}`;
}

export function getTtsCommandParts(params: TtsCommandParams): TtsCommandPart[] {
  const message = params.message;
  if (!params.voiceName.trim() || !message) return [];

  const voiceTag = buildVoiceTag(params);
  if (!voiceTag) return [];

  const parts: TtsCommandPart[] = [];

  if (params.redeemMethod === "cheer") {
    parts.push({ type: "cheer", text: `Cheer${params.bitAmount} ` });
  }

  parts.push({ type: "voiceTag", text: `${voiceTag} ` });
  parts.push({ type: "message", text: message });

  return parts;
}

/**
 * Compose a multi-voice message into display parts. The app splits a message at
 * every valid voice tag and speaks each run of text in its own voice, e.g.
 * `Cheer500 [ganom] hi [doc] hello [ganom] bye`. The leading tag owns the
 * request; later tags are mid-message switches. Segments without a voice are
 * skipped; a segment whose text is empty becomes a bare tag (valid mid-message).
 */
export function getMultiVoiceCommandParts({
  redeemMethod,
  bitAmount,
  segments,
}: TtsMultiCommandParams): TtsCommandPart[] {
  const usable = segments.filter((segment) => segment.voiceName.trim());
  if (!usable.length) return [];

  const parts: TtsCommandPart[] = [];

  if (redeemMethod === "cheer") {
    parts.push({ type: "cheer", text: `Cheer${bitAmount} ` });
  }

  usable.forEach((segment, index) => {
    const tag = buildVoiceTag(segment);
    const text = (segment.text ?? "").trim();
    const isLast = index === usable.length - 1;

    if (isLast && !text) {
      parts.push({ type: "voiceTag", text: tag });
      return;
    }

    parts.push({ type: "voiceTag", text: `${tag} ` });
    if (text) {
      parts.push({ type: "message", text: isLast ? text : `${text} ` });
    }
  });

  return parts;
}

export function buildMultiVoiceCommand(params: TtsMultiCommandParams): string {
  return getMultiVoiceCommandParts(params)
    .map((part) => part.text)
    .join("");
}

export function getRedeemBudget({
  redeemMethod,
  bitAmount,
  resubTier,
  pointsBudget = DEFAULT_POINTS_BUDGET,
  resubBudgets = RESUB_TIER_BUDGETS,
}: {
  redeemMethod: RedeemMethod;
  bitAmount: number;
  resubTier: ResubTier;
  pointsBudget?: number;
  resubBudgets?: Record<ResubTier, number>;
}): number {
  if (redeemMethod === "resub") return resubBudgets[resubTier];
  if (redeemMethod === "points") return pointsBudget;
  return bitAmount;
}

export function getMinCheerAmount({
  storeMinCost,
  selectedVoiceCost = 0,
}: {
  storeMinCost: number;
  selectedVoiceCost?: number;
}): number {
  return Math.max(storeMinCost, selectedVoiceCost);
}

export function getMaxMessageLengthForPrefix(
  prefix: string,
  maxCommandLength: number = MAX_TTS_COMMAND_LENGTH,
): number {
  return Math.max(0, maxCommandLength - prefix.length);
}
