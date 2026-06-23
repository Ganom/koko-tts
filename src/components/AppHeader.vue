<template>
  <header class="text-center mb-16 relative">
    <div
      class="absolute top-0 right-0 z-10 hidden md:flex items-center gap-3"
      v-motion="themeSelectorMotion"
    >
      <button
        @click="emit('toggle-info')"
        class="flex items-center justify-center p-2 bg-dark-800 border-2 rounded-lg transition-colors"
        :class="
          isInfoHidden
            ? 'border-primary-600/20 opacity-50 hover:opacity-100 hover:border-primary-500'
            : 'border-primary-600/40 hover:border-primary-500'
        "
        :aria-label="isInfoHidden ? 'Show instructions' : 'Hide instructions'"
      >
        <Info class="w-4 h-4 text-white" />
      </button>
      <ThemeSelector />
    </div>

    <h1
      class="text-4xl md:text-6xl font-bold text-gradient-violet-pink mb-4 animate-float"
      v-motion="titleMotion"
    >
      Koko TTS Voices
    </h1>
    <div class="flex justify-center mt-8 space-x-3" v-motion="decorativeContainerMotion">
      <div class="w-3 h-3 bg-primary-500 rounded-full" v-motion="decorativeDot1Motion" />
      <div class="w-3 h-3 bg-secondary-500 rounded-full" v-motion="decorativeDot2Motion" />
      <div class="w-3 h-3 bg-accent-500 rounded-full" v-motion="decorativeDot3Motion" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Info } from "@lucide/vue";
import ThemeSelector from "./ThemeSelector.vue";

defineProps<{
  isInfoHidden: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-info"): void;
}>();

const themeSelectorMotion = computed(() => ({
  initial: { opacity: 0, x: 20 },
  enter: { opacity: 1, x: 0, transition: { delay: 100, duration: 300 } },
}));

const titleMotion = computed(() => ({
  initial: { opacity: 0, y: -30 },
  enter: { opacity: 1, y: 0, transition: { duration: 400, ease: "easeOut" } },
}));

const decorativeContainerMotion = computed(() => ({
  initial: { opacity: 0, scale: 0.8 },
  enter: {
    opacity: 1,
    scale: 1,
    transition: { delay: 50, duration: 300, ease: "easeOut" },
  },
}));

const decorativeDot1Motion = computed(() => ({
  initial: { scale: 0 },
  enter: {
    scale: 1,
    transition: { delay: 150, duration: 200, ease: "backOut" },
  },
}));

const decorativeDot2Motion = computed(() => ({
  initial: { scale: 0 },
  enter: {
    scale: 1,
    transition: { delay: 200, duration: 200, ease: "backOut" },
  },
}));

const decorativeDot3Motion = computed(() => ({
  initial: { scale: 0 },
  enter: {
    scale: 1,
    transition: { delay: 250, duration: 200, ease: "backOut" },
  },
}));
</script>
