<script lang="ts">
export interface VoiceLineData {
  id: string;
  voiceName: string;
  model: string;
  effect: string;
  size: string;
  text: string;
}
</script>

<script setup lang="ts">
import { ChevronDown, Settings2, X } from "@lucide/vue";
import { computed, ref } from "vue";
import { useConfigStore } from "@/stores/configStore";
import type { Voice } from "@/types/voice";
import ButtonGroup from "@/components/ui/ButtonGroup.vue";
import CustomSelect from "./CustomSelect.vue";
import VoiceCarousel from "./VoiceCarousel.vue";

const props = defineProps<{
  segment: VoiceLineData;
  index: number;
  voices: Voice[];
  budget: number;
  canRemove: boolean;
}>();

const emit = defineEmits<{
  update: [patch: Partial<Omit<VoiceLineData, "id">>];
  selectVoice: [voiceName: string];
  remove: [];
}>();

const configStore = useConfigStore();
const optionsOpen = ref(false);

const textPlaceholder = computed(() => `What ${props.segment.voiceName || "this voice"} says...`);

// config-driven options
const customVoicesAllowed = computed(() => configStore.allowCustomVoices);
const sizeTokensEnabled = computed(() => configStore.sizeTokens.enabled);

const modelOptions = computed(() => [
  { label: "Default", value: "none" },
  ...configStore.models.map((m) => ({ label: m.label, value: m.tag })),
]);

const effectLabel = (tag: string) =>
  tag === "crt" ? "CRT" : tag.charAt(0).toUpperCase() + tag.slice(1);

const effectOptions = computed(() => [
  { label: "None", value: "none" },
  ...configStore.effects.requestable.map((tag) => ({ label: effectLabel(tag), value: tag })),
]);

const sizeOptions = computed(() => [
  { value: "none", label: "Normal", theme: "primary" },
  { value: configStore.sizeTokens.small, label: "Smol", theme: "secondary" },
  { value: configStore.sizeTokens.big, label: "Beeg", theme: "accent" },
]);

const optionsSummary = computed(() => {
  const parts: string[] = [];
  const { model, effect, size } = props.segment;
  if (model && model !== "none") {
    parts.push(configStore.models.find((m) => m.tag === model)?.label ?? model);
  }
  if (effect && effect !== "none") parts.push(effectLabel(effect));
  if (size && size !== "none") {
    parts.push(size === configStore.sizeTokens.big ? "Beeg" : "Smol");
  }
  return parts.length ? parts.join(" · ") : "Model, effect & size";
});

// warnings
const modelWarning = computed(() => {
  const tag = props.segment.model;
  if (!tag || tag === "none") return "";
  const model = configStore.models.find((m) => m.tag === tag);
  if (model && model.minBits > 0 && props.budget < model.minBits) {
    return `${model.label} needs ${model.minBits}+ bits; below that it falls back to the base voice.`;
  }
  return "";
});

const effectWarning = computed(() => {
  const tag = props.segment.effect;
  if (!tag || tag === "none") return "";
  const policy = configStore.effects.policy[tag];
  const label = effectLabel(tag);
  if (policy === "Disabled") return `${label} is turned off on this channel; it won't show.`;
  if (policy === "RedeemOnly")
    return `${label} only shows via the Channel Points redeem, not cheers.`;
  return "";
});

const hasWarning = computed(() => !!modelWarning.value || !!effectWarning.value);
</script>

<template>
  <div class="rounded-2xl border-2 border-secondary-500/20 bg-dark-900/40 p-4">
    <!-- Label row -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span
          class="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white"
        >
          {{ index + 1 }}
        </span>
        <h4 class="font-bold text-white">
          Voice {{ index + 1 }}
          <span v-if="segment.voiceName" class="font-normal text-gray-400">
            · {{ segment.voiceName }}
          </span>
        </h4>
      </div>
      <button
        v-if="canRemove"
        type="button"
        @click="emit('remove')"
        :aria-label="`Remove voice ${index + 1}`"
        class="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/40 text-red-300 transition-colors hover:bg-red-900/40 hover:text-white"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Voice selection IS the carousel (always visible, no dropdown) -->
    <VoiceCarousel
      :voices="voices"
      :selected-voice="segment.voiceName"
      :current-bit-amount="budget"
      @update:selectedVoice="(name: string) => emit('selectVoice', name)"
    />

    <!-- This voice's line -->
    <textarea
      :value="segment.text"
      @input="emit('update', { text: ($event.target as HTMLTextAreaElement).value })"
      :placeholder="textPlaceholder"
      rows="2"
      class="mt-3 w-full resize-none rounded-lg border-2 border-secondary-500/40 bg-dark-900/60 px-4 py-3 text-white transition-colors hover:border-secondary-500/60 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/50"
    ></textarea>

    <!-- Collapsible advanced options -->
    <div v-if="customVoicesAllowed" class="mt-2">
      <button
        type="button"
        @click="optionsOpen = !optionsOpen"
        class="flex items-center gap-1.5 text-xs font-medium transition-colors"
        :class="hasWarning ? 'text-yellow-300' : 'text-gray-400 hover:text-gray-200'"
      >
        <Settings2 class="h-3.5 w-3.5" />
        <span>{{ optionsSummary }}</span>
        <span v-if="hasWarning && !optionsOpen">⚠</span>
        <ChevronDown
          class="h-3.5 w-3.5 transition-transform duration-200"
          :class="{ 'rotate-180': optionsOpen }"
        />
      </button>

      <div v-if="optionsOpen" class="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-300">Voice model</label>
          <CustomSelect
            :model-value="segment.model"
            :options="modelOptions"
            @update:modelValue="(v: string | number) => emit('update', { model: String(v) })"
          />
          <p v-if="modelWarning" class="mt-1.5 text-xs text-yellow-300">⚠ {{ modelWarning }}</p>
        </div>
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-300">Character effect</label>
          <CustomSelect
            :model-value="segment.effect"
            :options="effectOptions"
            @update:modelValue="(v: string | number) => emit('update', { effect: String(v) })"
          />
          <p v-if="effectWarning" class="mt-1.5 text-xs text-yellow-300">⚠ {{ effectWarning }}</p>
        </div>
        <div v-if="sizeTokensEnabled" class="sm:col-span-2">
          <label class="mb-1 block text-xs font-semibold text-gray-300">Size</label>
          <ButtonGroup
            :model-value="segment.size"
            :options="sizeOptions"
            @update:modelValue="(v: string | number) => emit('update', { size: String(v) })"
          />
        </div>
      </div>
    </div>
  </div>
</template>
