<template>
  <nav
    class="mb-10 flex items-center gap-4"
    aria-label="Stage guide navigation"
    v-motion="stageGuideHeroMotions.nav"
  >
    <a
      :href="homeHref"
      class="inline-flex items-center gap-2 rounded-lg border-2 border-primary-500/30 bg-dark-900/45 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur transition-colors hover:border-primary-400 hover:bg-primary-900/30"
    >
      <ArrowLeft class="h-4 w-4 text-primary-300" />
      <span>Koko TTS Voices</span>
    </a>
  </nav>

  <header class="mb-8 text-center">
    <h1
      class="text-gradient-violet-pink animate-float mb-5 text-4xl font-bold md:text-6xl"
      v-motion="stageGuideHeroMotions.title"
    >
      Stage How-To
    </h1>
    <p
      class="mx-auto max-w-3xl text-lg text-gray-300 md:text-xl"
      v-motion="stageGuideHeroMotions.subtitle"
    >
      Grab the exact stream commands for joining stage, landing a heckle, or voting on the current
      performer.
    </p>
    <div
      class="mt-8 flex justify-center space-x-3"
      data-testid="stage-decorative-dots"
      aria-hidden="true"
      v-motion="stageGuideHeroMotions.decorativeContainer"
    >
      <span
        class="h-3 w-3 rounded-full bg-primary-500"
        v-motion="stageGuideHeroMotions.decorativeDot1"
      />
      <span
        class="h-3 w-3 rounded-full bg-secondary-500"
        v-motion="stageGuideHeroMotions.decorativeDot2"
      />
      <span
        class="h-3 w-3 rounded-full bg-accent-500"
        v-motion="stageGuideHeroMotions.decorativeDot3"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { stageGuideHeroMotions } from "./stageGuideMotions";

defineProps<{
  homeHref: string;
}>();
</script>
