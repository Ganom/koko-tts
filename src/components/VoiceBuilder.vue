<template>
  <div class="max-w-6xl mx-auto mb-16">
    <div
      class="anime-card rounded-4xl p-6 sm:p-8 border-2 border-primary-500/30"
      v-motion="motions.container"
    >
      <div class="text-center mb-8" v-motion="motions.header">
        <h2 class="text-gradient-violet-pink text-3xl font-bold mb-3">TTS Message Builder</h2>
        <p class="text-gray-300 text-lg">
          Write one voice or a whole dialogue, then copy &amp; paste
        </p>
      </div>

      <!-- How it's sent -->
      <div class="space-y-6 mb-8" v-motion="motions.controls">
        <FormSection title="Redeem Method">
          <ButtonGroup
            :options="redeemOptions"
            v-model="redeemMethod"
            @update:modelValue="checkVoiceEligibility"
          />
        </FormSection>

        <FormSection v-if="redeemMethod === 'cheer'" title="Bit Amount">
          <input
            v-model.number="bitAmount"
            type="number"
            :min="minBitAmount"
            :placeholder="minBitAmount.toString()"
            :class="[
              'w-full bg-dark-900/60 border-2 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 transition-colors',
              inputClasses,
              { 'flash-border': bitAmountUpdated },
            ]"
          />
          <p v-if="minBitAmount > voiceStore.minCost" class="text-sm text-primary-300 mt-2">
            Minimum {{ minBitAmount }} bits to cover your voices
          </p>
          <p v-else-if="bitAmount" class="text-sm text-gray-400 mt-2">
            Voices up to {{ bitAmount }} bits available
          </p>
        </FormSection>

        <FormSection v-if="redeemMethod === 'resub'" title="Subscription Tier">
          <ButtonGroup
            :options="tierOptions"
            v-model="resubTier"
            @update:modelValue="checkVoiceEligibility"
          />
        </FormSection>
      </div>

      <!-- The message: a script of voice lines -->
      <div v-motion="motions.lines">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-white text-xl font-bold">Your message</h3>
          <span class="text-xs text-gray-400"
            >{{ segments.length }} / {{ maxSegments }} voices</span
          >
        </div>

        <div class="space-y-3">
          <VoiceLine
            v-for="(segment, index) in segments"
            :key="segment.id"
            :segment="segment"
            :index="index"
            :voices="allVoices"
            :budget="bitAmountForGrid"
            :can-remove="segments.length > 1"
            @select-voice="(name: string) => onSelectVoice(segment.id, name)"
            @update="(patch) => updateSegment(segment.id, patch)"
            @remove="removeSegment(segment.id)"
          />
        </div>

        <button
          v-if="customVoicesAllowed && segments.length < maxSegments"
          type="button"
          @click="addSegment"
          class="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-600/50 py-3 text-primary-300 transition-colors hover:border-primary-500 hover:bg-primary-500/10"
        >
          <Plus class="h-5 w-5" />
          <span class="font-semibold">Add a voice line</span>
        </button>
        <p v-else-if="customVoicesAllowed" class="mt-3 text-center text-xs text-gray-400">
          Max {{ maxSegments }} voices reached for this channel.
        </p>
      </div>

      <div
        class="w-full h-px bg-gradient-to-r from-transparent via-primary-700/50 to-transparent my-8"
      ></div>

      <!-- Preview -->
      <div
        class="anime-card rounded-2xl p-6 border-2 border-primary-500/30"
        v-motion="motions.preview"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-white font-bold flex items-center">
            <Menu class="w-5 h-5 mr-2 text-primary-400" />
            TTS Preview
          </h4>
          <div class="flex items-center gap-4">
            <span
              class="text-sm font-mono"
              :class="isMessageTooLong ? 'text-red-400' : 'text-gray-400'"
            >
              {{ generatedCommand.length }}/{{ maxCommandLength }}
            </span>
            <button
              v-if="commandParts.length"
              @click="copyCommand"
              class="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded transition-colors whitespace-nowrap"
            >
              <component :is="copied ? Check : Clipboard" class="w-4 h-4" />
              <span>{{ copied ? "Copied!" : "Copy" }}</span>
            </button>
          </div>
        </div>
        <div class="bg-dark-900/50 border-2 border-primary-500/20 rounded-lg p-4 font-mono text-md">
          <div v-if="commandParts.length" class="break-all min-h-[2lh]">
            <span v-for="(part, index) in commandParts" :key="index" :class="part.class">
              {{ part.text }}
            </span>
          </div>
          <div v-else class="text-gray-500 italic">
            Pick a voice and type a message to see the TTS preview
          </div>
        </div>
        <p v-if="isMessageTooLong" class="text-sm text-red-400 mt-2">
          Message exceeds the {{ maxCommandLength }} character limit. Trim it before sending.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Clipboard, Menu, Plus } from "@lucide/vue";
import { computed, onMounted, ref, watch } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";
import { useConfigStore } from "@/stores/configStore";
import { useVoiceStore } from "@/stores/voiceStore";
import type { Voice } from "@/types/voice";
import {
  type RedeemMethod,
  type ResubTier,
  type TtsSegment,
  buildMultiVoiceCommand,
  getMinCheerAmount,
  getMultiVoiceCommandParts,
  getRedeemBudget,
  isRandomVoiceName,
} from "@/domain/ttsCommand";
import ButtonGroup from "@/components/ui/ButtonGroup.vue";
import FormSection from "@/components/ui/FormSection.vue";
import VoiceLine, { type VoiceLineData } from "./VoiceLine.vue";

const voiceStore = useVoiceStore();
const configStore = useConfigStore();

const inputClasses =
  "border-secondary-500/40 hover:border-secondary-500/60 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/50";

const redeemOptions = [
  { value: "cheer", label: "Cheer", theme: "primary" },
  { value: "points", label: "Channel Points", theme: "secondary" },
  { value: "resub", label: "Resub", theme: "accent" },
];

const motions = {
  container: {
    initial: { opacity: 0, y: 50 },
    enter: { opacity: 1, y: 0, transition: { delay: 400, duration: 400, ease: "easeOut" } },
  },
  header: {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { delay: 450, duration: 300 } },
  },
  controls: {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { delay: 500, duration: 300, ease: "easeOut" } },
  },
  lines: {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { delay: 550, duration: 300, ease: "easeOut" } },
  },
  preview: {
    initial: { opacity: 0, y: 30 },
    enter: { opacity: 1, y: 0, transition: { delay: 600, duration: 300, ease: "easeOut" } },
  },
};

// segment state
interface PersistedSettings {
  segments?: Omit<VoiceLineData, "id">[];
  redeemMethod?: RedeemMethod;
  bitAmount?: number;
  resubTier?: ResubTier;
  // Legacy single-voice shape (pre multi-voice), migrated on load.
  selectedVoice?: string;
  selectedModel?: string;
  characterEffect?: string;
  message?: string;
}

let segmentSeq = 0;
// New voice lines default to the Eleven v3 model (config tag "v3").
const DEFAULT_MODEL = "v3";
const makeSegment = (init: Partial<VoiceLineData> = {}): VoiceLineData => ({
  id: `seg-${segmentSeq++}`,
  voiceName: "",
  model: DEFAULT_MODEL,
  effect: "none",
  size: "none",
  text: "",
  ...init,
});

function initSegments(raw: PersistedSettings): VoiceLineData[] {
  if (raw.segments?.length) {
    return raw.segments.map((segment) =>
      makeSegment({
        voiceName: segment.voiceName ?? "",
        model: segment.model ?? DEFAULT_MODEL,
        effect: segment.effect ?? "none",
        size: segment.size ?? "none",
        text: segment.text ?? "",
      }),
    );
  }
  if (raw.selectedVoice !== undefined || raw.selectedModel !== undefined) {
    return [
      makeSegment({
        voiceName: raw.selectedVoice ?? "",
        model: raw.selectedModel ?? DEFAULT_MODEL,
        effect: raw.characterEffect ?? "none",
        text: raw.message ?? "",
      }),
    ];
  }
  return [makeSegment()];
}

const defaultSettings: PersistedSettings = {
  segments: [{ voiceName: "", model: DEFAULT_MODEL, effect: "none", size: "none", text: "" }],
  redeemMethod: "cheer",
  bitAmount: 5000,
  resubTier: 1,
};
const [settings, setSettings] = useLocalStorage<PersistedSettings>(
  "voiceBuilderSettings",
  defaultSettings,
);

const segments = ref<VoiceLineData[]>(initSegments(settings.value));
const redeemMethod = ref<RedeemMethod>(settings.value.redeemMethod ?? "cheer");
const bitAmount = ref<number>(settings.value.bitAmount ?? 5000);
const resubTier = ref<ResubTier>(settings.value.resubTier ?? 1);
const copied = ref(false);
const bitAmountUpdated = ref(false);

const tierOptions = computed(() => [
  { value: 1, label: "Tier 1", detail: `${configStore.resubTierBits["1"]} bits`, theme: "primary" },
  {
    value: 2,
    label: "Tier 2",
    detail: `${configStore.resubTierBits["2"]} bits`,
    theme: "secondary",
  },
  { value: 3, label: "Tier 3", detail: `${configStore.resubTierBits["3"]} bits`, theme: "accent" },
]);

// config-driven limits
const customVoicesAllowed = computed(() => configStore.allowCustomVoices);
const maxCommandLength = computed(() => configStore.maxCommandLength);
const maxSegments = computed(() => (customVoicesAllowed.value ? configStore.maxSegments : 1));

// voices + budget
const randomVoice = computed<Voice>(() => ({
  name: "Random",
  text: "",
  cost: voiceStore.minCost,
  kind: "random",
}));
const allVoices = computed<Voice[]>(() => {
  if (!voiceStore.voices.length) return [];
  return [randomVoice.value, ...voiceStore.sortedVoices];
});
const getVoiceByName = (name: string) => allVoices.value.find((v) => v.name === name);

const resubBudgets = computed(
  () =>
    ({
      1: configStore.resubTierBits["1"],
      2: configStore.resubTierBits["2"],
      3: configStore.resubTierBits["3"],
    }) as Record<ResubTier, number>,
);

const bitAmountForGrid = computed(() =>
  getRedeemBudget({
    redeemMethod: redeemMethod.value,
    bitAmount: bitAmount.value,
    resubTier: resubTier.value,
    pointsBudget: configStore.redeemValue,
    resubBudgets: resubBudgets.value,
  }),
);

const maxSegmentVoiceCost = computed(() => {
  let max = 0;
  for (const segment of segments.value) {
    if (segment.voiceName && !isRandomVoiceName(segment.voiceName)) {
      max = Math.max(max, getVoiceByName(segment.voiceName)?.cost ?? 0);
    }
  }
  return max;
});

const minBitAmount = computed(() =>
  getMinCheerAmount({
    storeMinCost: voiceStore.minCost,
    selectedVoiceCost: maxSegmentVoiceCost.value,
  }),
);

// command composition
function segmentDisplayText(segment: VoiceLineData): string {
  if (segment.text) return segment.text;
  if (!segment.voiceName || isRandomVoiceName(segment.voiceName)) return "";
  return getVoiceByName(segment.voiceName)?.text ?? "";
}

const commandSegments = computed<TtsSegment[]>(() =>
  segments.value.map((segment) => ({
    voiceName: segment.voiceName,
    model: segment.model,
    effect: segment.effect,
    size: segment.size,
    text: segmentDisplayText(segment),
  })),
);

const generatedCommand = computed(() =>
  buildMultiVoiceCommand({
    redeemMethod: redeemMethod.value,
    bitAmount: bitAmount.value,
    segments: commandSegments.value,
  }),
);

const commandParts = computed(() =>
  getMultiVoiceCommandParts({
    redeemMethod: redeemMethod.value,
    bitAmount: bitAmount.value,
    segments: commandSegments.value,
  }).map((part) => ({
    text: part.text,
    class:
      part.type === "cheer"
        ? "text-primary-300"
        : part.type === "voiceTag"
          ? "text-secondary-400"
          : "text-accent-400",
  })),
);

const isMessageTooLong = computed(() => generatedCommand.value.length > maxCommandLength.value);

// segment actions
function updateSegment(id: string, patch: Partial<Omit<VoiceLineData, "id">>) {
  const segment = segments.value.find((s) => s.id === id);
  if (segment) Object.assign(segment, patch);
}

function onSelectVoice(id: string, voiceName: string) {
  updateSegment(id, { voiceName });
  bumpBitsToCover();
}

function addSegment() {
  if (segments.value.length >= maxSegments.value) return;
  segments.value.push(makeSegment());
}

function removeSegment(id: string) {
  if (segments.value.length <= 1) return;
  segments.value = segments.value.filter((s) => s.id !== id);
}

function checkVoiceEligibility() {
  const budget = bitAmountForGrid.value;
  for (const segment of segments.value) {
    if (segment.voiceName && !isRandomVoiceName(segment.voiceName)) {
      const cost = getVoiceByName(segment.voiceName)?.cost ?? 0;
      if (cost > budget) segment.voiceName = "";
    }
  }
}

// bit-amount helpers
function triggerFlash() {
  bitAmountUpdated.value = true;
  setTimeout(() => {
    bitAmountUpdated.value = false;
  }, 1500);
}

function bumpBitsToCover() {
  if (redeemMethod.value !== "cheer") return;
  const target = Math.max(voiceStore.minCost, maxSegmentVoiceCost.value);
  if (bitAmount.value < target) {
    bitAmount.value = target;
    triggerFlash();
  }
}

async function copyCommand() {
  if (!generatedCommand.value || copied.value) return;
  await navigator.clipboard.writeText(generatedCommand.value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

// watchers + lifecycle
let debounceTimeout: number;
watch(bitAmount, (newAmount) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    if (redeemMethod.value !== "cheer") return;

    let effectiveAmount = newAmount || 0;
    if (effectiveAmount > 0 && effectiveAmount < voiceStore.minCost) {
      effectiveAmount = voiceStore.minCost;
      if (bitAmount.value !== voiceStore.minCost) {
        bitAmount.value = voiceStore.minCost;
        triggerFlash();
      }
    }

    for (const segment of segments.value) {
      if (segment.voiceName && !isRandomVoiceName(segment.voiceName)) {
        const cost = getVoiceByName(segment.voiceName)?.cost ?? 0;
        if (effectiveAmount < cost) segment.voiceName = "";
      }
    }
  }, 500);
});

watch(
  [segments, redeemMethod, bitAmount, resubTier],
  () => {
    setSettings({
      segments: segments.value.map(({ voiceName, model, effect, size, text }) => ({
        voiceName,
        model,
        effect,
        size,
        text,
      })),
      redeemMethod: redeemMethod.value,
      bitAmount: bitAmount.value,
      resubTier: resubTier.value,
    });
  },
  { deep: true },
);

onMounted(() => {
  if (!voiceStore.voices.length) {
    voiceStore.loadVoices();
  }
});
</script>

<style scoped>
@keyframes flash {
  50% {
    border-color: var(--theme-primary-400);
  }
}
</style>
