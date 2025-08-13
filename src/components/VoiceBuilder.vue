<template>
  <div class="max-w-6xl mx-auto mb-16">
    <div
      class="anime-card bg-gradient-dark rounded-4xl p-8 border border-primary-700/30"
      v-motion="motions.container"
    >
      <div class="text-center mb-8" v-motion="motions.header">
        <h2 class="text-gradient-violet-pink text-3xl font-bold mb-3">TTS Message Builder</h2>
        <p class="text-gray-300 text-lg">Build and preview your TTS Message</p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8 mb-8">
        <div class="space-y-6" v-motion="motions.controls">
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
                'w-full bg-dark-900/60 border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 transition-colors',
                inputClasses,
                { 'flash-border': bitAmountUpdated },
              ]"
            />
            <p
              v-if="selectedVoice && minBitAmount > voiceStore.minCost"
              class="text-sm text-primary-300 mt-2"
            >
              Minimum {{ minBitAmount }} bits for {{ selectedVoice }}
            </p>
            <p v-else-if="redeemMethod === 'cheer' && bitAmount" class="text-sm text-gray-400 mt-2">
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

          <FormSection title="Your Message">
            <textarea
              v-model="message"
              placeholder="Enter your message here..."
              :class="[
                'w-full bg-dark-900/60 border rounded-lg px-4 py-3 text-white focus:outline-none resize-none',
                inputClasses,
              ]"
              rows="3"
            ></textarea>
          </FormSection>

          <FormSection title="Text Effect">
            <CustomSelect v-model="textEffect" :options="textEffectOptions" />
          </FormSection>

          <FormSection title="Voice Model">
            <CustomSelect v-model="selectedModel" :options="modelOptions" />
          </FormSection>
        </div>

        <div class="space-y-6" v-motion="motions.voiceGrid">
          <FormSection>
            <template #title>
              <div class="flex items-center justify-between w-full">
                <span>Select a Voice</span>
                <div v-if="selectedVoice" class="flex items-center gap-3">
                  <span class="text-gray-300 text-sm">Preview:</span>
                  <AudioPlayerSquare :voice-name="selectedVoice" />
                </div>
              </div>
            </template>
            <VoiceGrid
              v-model:selectedVoice="selectedVoice"
              :voices="allVoices"
              :current-bit-amount="bitAmountForGrid"
              @change="updateBitAmountFromGrid"
            />
          </FormSection>
        </div>
      </div>

      <div
        class="w-full h-px bg-gradient-to-r from-transparent via-primary-700/50 to-transparent mb-8"
      ></div>

      <div
        class="anime-card bg-gradient-dark rounded-2xl p-6 border border-primary-700/30"
        v-motion="motions.preview"
      >
        <h4 class="text-white font-bold mb-4 flex items-center">
          <Bars3Icon class="w-5 h-5 mr-2 text-primary-400" />
          TTS Preview
        </h4>
        <div class="bg-dark-900/50 border border-primary-700/20 rounded-lg p-4 font-mono text-sm">
          <div v-if="commandParts.length" class="flex items-center justify-between gap-4">
            <div class="break-all flex-1">
              <span v-for="(part, index) in commandParts" :key="index" :class="part.class">
                {{ part.text }}
              </span>
            </div>
            <button
              @click="copyCommand"
              class="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded transition-colors whitespace-nowrap"
            >
              <component :is="copied ? CheckIcon : ClipboardIcon" class="w-4 h-4" />
              <span>{{ copied ? "Copied!" : "Copy" }}</span>
            </button>
          </div>
          <div v-else class="text-gray-500 italic">
            Configure your voice message to see the TTS preview
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bars3Icon, CheckIcon, ClipboardIcon } from "@heroicons/vue/24/solid";
import { computed, defineComponent, h, onMounted, ref, watch } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";
import { useVoiceStore } from "@/stores/voiceStore";
import type { Voice } from "@/types/voice";
import AudioPlayerSquare from "./AudioPlayerSquare.vue";
import CustomSelect from "./CustomSelect.vue";
import VoiceGrid from "./VoiceGrid.vue";

// --- LOCAL SUB-COMPONENTS ---

const FormSection = defineComponent({
  props: { title: { type: String, default: "" } },
  setup(props, { slots }) {
    return () =>
      h("div", {}, [
        props.title
          ? h("label", { class: "block text-white font-bold mb-3" }, props.title)
          : slots.title
            ? h("div", { class: "block text-white font-bold mb-3" }, slots.title())
            : null,
        slots.default ? slots.default() : null,
      ]);
  },
});

interface ButtonOption {
  value: string | number;
  label: string;
  detail?: string;
  theme: string;
}

const ButtonGroup = defineComponent({
  props: {
    modelValue: { type: [String, Number], required: true },
    options: {
      type: Array as () => Array<ButtonOption>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const getButtonClasses = (opt: ButtonOption, isSelected: boolean) => {
      const baseClasses =
        "p-3 rounded-lg border text-white font-medium transition-colors text-center";
      const bgClasses = isSelected ? getBgClass(opt.theme) : "bg-dark-700 hover:bg-dark-600";
      const borderClasses = getBorderClass(opt.theme);
      return `${baseClasses} ${bgClasses} ${borderClasses}`;
    };

    const getBgClass = (theme: string) => {
      switch (theme) {
        case "primary":
          return "bg-primary-600";
        case "secondary":
          return "bg-secondary-600";
        case "accent":
          return "bg-accent-600";
        default:
          return "bg-primary-600";
      }
    };

    const getBorderClass = (theme: string) => {
      switch (theme) {
        case "primary":
          return "border-primary-700/40";
        case "secondary":
          return "border-secondary-700/40";
        case "accent":
          return "border-accent-700/40";
        default:
          return "border-primary-700/40";
      }
    };

    const getTextClass = (theme: string) => {
      switch (theme) {
        case "primary":
          return "text-sm text-primary-300";
        case "secondary":
          return "text-sm text-secondary-300";
        case "accent":
          return "text-sm text-accent-300";
        default:
          return "text-sm text-primary-300";
      }
    };

    return () =>
      h(
        "div",
        { class: "grid grid-cols-3 gap-3" },
        props.options.map((opt) =>
          h(
            "button",
            {
              onClick: () => emit("update:modelValue", opt.value),
              class: getButtonClasses(opt, props.modelValue === opt.value),
            },
            [
              opt.label,
              opt.detail ? h("br") : null,
              opt.detail ? h("span", { class: getTextClass(opt.theme) }, opt.detail) : null,
            ],
          ),
        ),
      );
  },
});

// --- DATA & CONFIGURATION ---

const voiceStore = useVoiceStore();
const inputClasses =
  "border-primary-700/40 hover:border-primary-500/60 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50";

const redeemOptions = [
  { value: "cheer", label: "Cheer", theme: "primary" },
  { value: "points", label: "Channel Points", theme: "secondary" },
  { value: "resub", label: "Resub", theme: "accent" },
];

const tierOptions = [
  { value: 1, label: "Tier 1", detail: "500 bits", theme: "primary" },
  { value: 2, label: "Tier 2", detail: "1000 bits", theme: "secondary" },
  { value: 3, label: "Tier 3", detail: "2500 bits", theme: "accent" },
];

const textEffectOptions = [
  { label: "None", value: "none" },
  {
    label: "Glitch",
    value: "glitch",
  },
  { label: "Typewriter", value: "typewriter" },
  {
    label: "Rainbow Wave",
    value: "rainbow",
  },
  { label: "Karaoke", value: "karaoke" },
];
const modelOptions = [
  { label: "None", value: "none" },
  { label: "Turbo v2", value: "turbo" },
  {
    label: "Turbo v2.5",
    value: "turbov2.5",
  },
  { label: "Flash v2", value: "flashv2" },
  {
    label: "Flash v2.5",
    value: "flashv2.5",
  },
  { label: "Multilingual v2", value: "multilingual" },
];

// --- ANIMATIONS ---

const motions = {
  container: {
    initial: { opacity: 0, y: 50 },
    enter: {
      opacity: 1,
      y: 0,
      transition: { delay: 400, duration: 400, ease: "easeOut" },
    },
  },
  header: {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { delay: 450, duration: 300 } },
  },
  controls: {
    initial: { opacity: 0, x: -30 },
    enter: {
      opacity: 1,
      x: 0,
      transition: { delay: 500, duration: 300, ease: "easeOut" },
    },
  },
  voiceGrid: {
    initial: { opacity: 0, x: 30 },
    enter: {
      opacity: 1,
      x: 0,
      transition: { delay: 550, duration: 300, ease: "easeOut" },
    },
  },
  preview: {
    initial: { opacity: 0, y: 30 },
    enter: {
      opacity: 1,
      y: 0,
      transition: { delay: 600, duration: 300, ease: "easeOut" },
    },
  },
};

// --- STATE MANAGEMENT ---

interface Settings {
  selectedVoice: string;
  redeemMethod: "cheer" | "points" | "resub";
  bitAmount: number;
  resubTier: 1 | 2 | 3;
  textEffect: string;
  selectedModel: string;
  message: string;
}

const defaultSettings: Settings = {
  selectedVoice: "",
  redeemMethod: "cheer",
  bitAmount: 5000,
  resubTier: 1,
  textEffect: "none",
  selectedModel: "none",
  message: "",
};
const [settings, setSettings] = useLocalStorage("voiceBuilderSettings", defaultSettings);

const selectedVoice = ref(settings.value.selectedVoice);
const message = ref(settings.value.message);
const redeemMethod = ref(settings.value.redeemMethod);
const bitAmount = ref(settings.value.bitAmount);
const resubTier = ref(settings.value.resubTier);
const textEffect = ref(settings.value.textEffect);
const selectedModel = ref(settings.value.selectedModel);
const copied = ref(false);
const bitAmountUpdated = ref(false);

// --- VOICE DATA & ELIGIBILITY ---

const allVoices = computed(() => voiceStore.sortedVoices);
const getVoiceByName = (name: string) => allVoices.value.find((v) => v.name === name);

const bitAmountForGrid = computed(() => {
  if (redeemMethod.value === "resub") return { 1: 500, 2: 1000, 3: 2500 }[resubTier.value];
  if (redeemMethod.value === "points") return 999;
  return bitAmount.value;
});

const eligibleVoices = computed<Voice[]>(() => {
  const maxCost = bitAmountForGrid.value;
  return allVoices.value
    .filter((voice) => voice.cost <= maxCost)
    .sort((a, b) => b.cost - a.cost || a.name.localeCompare(b.name));
});

const minBitAmount = computed(() => {
  const voiceCost = getVoiceByName(selectedVoice.value)?.cost ?? 0;
  return Math.max(voiceStore.minCost, voiceCost);
});

function checkVoiceEligibility() {
  if (selectedVoice.value && !eligibleVoices.value.some((v) => v.name === selectedVoice.value)) {
    selectedVoice.value = "";
  }
}

// --- COMMAND GENERATION ---

const displayMessage = computed(
  () => message.value.trim() || getVoiceByName(selectedVoice.value)?.text || "",
);

const generatedCommand = computed(() => {
  if (!selectedVoice.value || !displayMessage.value) return "";

  const voiceName = selectedVoice.value.toLowerCase();
  const model = selectedModel.value !== "none" ? `:${selectedModel.value}` : "";
  const effect = textEffect.value !== "none" ? `:${textEffect.value}` : "";
  const voiceTag = `[${voiceName}${model}${effect}]`;

  if (redeemMethod.value === "cheer")
    return `Cheer${bitAmount.value} ${voiceTag} ${displayMessage.value}`;
  return `${voiceTag} ${displayMessage.value}`;
});

const commandParts = computed(() => {
  if (!generatedCommand.value) return [];

  const parts = [];
  if (redeemMethod.value === "cheer") {
    parts.push({ text: `Cheer${bitAmount.value} `, class: "text-primary-300" });
  }

  const voiceTagMatch = generatedCommand.value.match(/(\[.*?])/);
  if (voiceTagMatch) {
    parts.push({ text: `${voiceTagMatch[1]} `, class: "text-secondary-400" });
  }

  parts.push({ text: displayMessage.value, class: "text-accent-400" });
  return parts;
});

// --- METHODS & ACTIONS ---

function triggerFlash() {
  bitAmountUpdated.value = true;
  setTimeout(() => {
    bitAmountUpdated.value = false;
  }, 1500);
}

function updateBitAmountFromGrid(isSearching: boolean = false) {
  if (redeemMethod.value !== "cheer" || !selectedVoice.value) return;

  const voiceCost = getVoiceByName(selectedVoice.value)?.cost ?? 0;
  const targetAmount = Math.max(voiceStore.minCost, voiceCost);

  if (
    (isSearching && bitAmount.value !== targetAmount) ||
    (!isSearching && bitAmount.value < targetAmount)
  ) {
    bitAmount.value = targetAmount;
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

// --- WATCHERS & LIFECYCLE ---

let debounceTimeout: number;
watch(bitAmount, (newAmount) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const currentAmount = newAmount || 0;

    if (selectedVoice.value) {
      const voiceCost = getVoiceByName(selectedVoice.value)?.cost ?? 0;
      if (currentAmount < voiceCost) {
        selectedVoice.value = "";
      }
    }

    if (currentAmount > 0 && currentAmount < voiceStore.minCost) {
      bitAmount.value = voiceStore.minCost;
      triggerFlash();
    }
  }, 500);
});

watch(
  [selectedVoice, redeemMethod, bitAmount, resubTier, textEffect, selectedModel, message],
  () => {
    setSettings({
      selectedVoice: selectedVoice.value,
      redeemMethod: redeemMethod.value,
      bitAmount: bitAmount.value,
      resubTier: resubTier.value,
      textEffect: textEffect.value,
      selectedModel: selectedModel.value,
      message: message.value,
    });
  },
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
