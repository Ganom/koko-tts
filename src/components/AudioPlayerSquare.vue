<template>
  <button @click="togglePlay" :disabled="isDisabled" :class="buttonClasses" :title="errorTitle">
    <component :is="mainIconComponent" :class="mainIconClasses" />

    <TriangleAlert v-if="isError" class="w-4 h-4 text-white" />
  </button>
</template>

<script setup lang="ts">
import { Pause, Play, RotateCcw, TriangleAlert } from "@lucide/vue";
import { computed, inject } from "vue";
import { PlaybackStatus } from "@/types/audio";
import { audioKey } from "@/injectionKeys";

interface Props {
  voiceName: string;
}

const props = defineProps<Props>();

const audio = inject(audioKey);
if (!audio) {
  throw new Error("Audio composable not provided");
}

const status = computed(() => audio.playbackStatus.get(props.voiceName) || PlaybackStatus.IDLE);
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
  "group relative flex min-w-[5rem] items-center justify-center rounded-lg border border-secondary-600/40 bg-gradient-dark px-3 py-2 transition-all duration-300 hover:border-secondary-500/60 hover:bg-gradient-to-r hover:from-secondary-600/20 hover:to-secondary-600/20 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-700",
  { "animate-pulse": isCurrentlyPlaying.value },
]);

const errorTitle = computed(() => (isError.value ? "Audio file not available" : ""));

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
