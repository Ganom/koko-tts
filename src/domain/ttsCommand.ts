export const MAX_TTS_COMMAND_LENGTH = 500;

export type RedeemMethod = "cheer" | "points" | "resub";
export type ResubTier = 1 | 2 | 3;

export type VoiceModifier = string | null | undefined;

export interface TtsVoiceTagParams {
  voiceName: string;
  model?: VoiceModifier;
  effect?: VoiceModifier;
}

export interface TtsCommandParams extends TtsVoiceTagParams {
  redeemMethod: RedeemMethod;
  bitAmount: number;
  message: string;
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

export const DEFAULT_POINTS_BUDGET = 999;

function toModifierSuffix(value: VoiceModifier): string {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed || trimmed === "none") return "";
  return `:${trimmed}`;
}

export function isRandomVoiceName(name: string): boolean {
  return name.trim().toLowerCase() === "random";
}

export function buildVoiceTag({ voiceName, model, effect }: TtsVoiceTagParams): string {
  const trimmedName = voiceName.trim();
  if (!trimmedName) return "";

  const voice = trimmedName.toLowerCase();
  return `[${voice}${toModifierSuffix(model)}${toModifierSuffix(effect)}]`;
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

export function getRedeemBudget({
  redeemMethod,
  bitAmount,
  resubTier,
  pointsBudget = DEFAULT_POINTS_BUDGET,
}: {
  redeemMethod: RedeemMethod;
  bitAmount: number;
  resubTier: ResubTier;
  pointsBudget?: number;
}): number {
  if (redeemMethod === "resub") return RESUB_TIER_BUDGETS[resubTier];
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

