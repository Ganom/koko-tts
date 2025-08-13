<template>
  <button @click="togglePlay" :disabled="isDisabled" :class="buttonClasses" :title="errorTitle">
    <component :is="mainIconComponent" :class="mainIconClasses" />

    <TriangleAlert v-if="isError" class="w-4 h-4 text-white" />
  </button>
</template>

<script setup lang="ts">
import { Pause, Play, RotateCcw, TriangleAlert } from "lucide-vue-next";
import { computed, inject } from "vue";
import type { UseAudioReturn } from "@/composables/useAudio";
import { PlaybackStatus } from "@/types/audio";

// --- PROPS ---

interface Props {
  voiceName: string;
}

const props = defineProps<Props>();

// --- INJECT ---

const audio = inject<UseAudioReturn>("audio");
if (!audio) {
  throw new Error("Audio composable not provided");
}

// --- STATE & COMPUTED ---

const status = computed(
  () => audio.playbackStatus.value.get(props.voiceName) || PlaybackStatus.IDLE,
);
const isCurrentlyPlaying = computed(() => audio.isPlaying(props.voiceName));
const isLoading = computed(() => status.value === PlaybackStatus.LOADING);
const isError = computed(() => status.value === PlaybackStatus.ERROR);
const isDisabled = computed(() => isError.value);

const mainIconComponent = computed(() => {
  if (isLoading.value) return RotateCcw;
  if (isCurrentlyPlaying.value) return Pause;
  return Play;
});

const mainIconClasses = computed(() => {
  const baseClasses = "w-4 h-4 text-white";
  if (isLoading.value) {
    return [baseClasses, "animate-spin"];
  }
  return [baseClasses, "group-hover:scale-110 transition-transform duration-200"];
});

const buttonClasses = computed(() => [
  "group relative flex min-w-[2.5rem] items-center justify-center rounded-lg border border-primary-600/40 bg-gradient-dark px-3 py-2 transition-all duration-300 hover:border-primary-500/60 hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-secondary-600/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700",
  { "animate-pulse": isCurrentlyPlaying.value },
]);

const errorTitle = computed(() => (isError.value ? "Audio file not available" : ""));

// --- METHODS ---
const togglePlay = async () => {
  if (isError.value) return;

  try {
    if (isCurrentlyPlaying.value) {
      audio.pause(props.voiceName);
    } else {
      await audio.play(props.voiceName);
    }
  } catch (error) {
    console.error(`Error playing ${props.voiceName}:`, error);
  }
};
</script>
