<template>
  <section
    class="stage-help-panel mb-8 rounded-lg border-2 border-accent-500/45 p-5"
    aria-label="First time stage help"
    v-motion="stageGuideBannerMotion"
  >
    <div class="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
      <div
        class="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-500 text-dark-950"
        aria-hidden="true"
      >
        <Info class="h-6 w-6" />
      </div>
      <div>
        <p class="font-bold text-white">New to Koko TTS voices?</p>
        <p class="mt-1 text-sm text-gray-300">
          Visit the main page first if you need voice names, defaults, or examples.
        </p>
      </div>
      <a
        :href="homeHref"
        class="inline-flex items-center justify-center gap-2 rounded-lg border border-accent-400/45 bg-accent-500/10 px-4 py-2 text-sm font-bold text-accent-100 transition-colors hover:border-accent-300 hover:bg-accent-500/20"
      >
        <span>Visit the main voices page</span>
        <ExternalLink class="h-4 w-4" />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ExternalLink, Info } from "lucide-vue-next";
import { stageGuideBannerMotion } from "./stageGuideMotions";

defineProps<{
  homeHref: string;
}>();
</script>

<style scoped>
.stage-help-panel {
  background: color-mix(in srgb, var(--theme-gray-900) 88%, var(--theme-dark-950));
  backdrop-filter: blur(10px);
  box-shadow:
    0 22px 30px color-mix(in srgb, var(--theme-dark-950) 55%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--theme-gray-100) 8%, transparent);
}
</style>
