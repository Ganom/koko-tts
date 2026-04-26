<template>
  <main class="max-w-7xl mx-auto pb-16">
    <StageGuideHero :home-href="homeHref" />
    <StageHelpPanel :home-href="homeHref" />

    <section class="grid gap-6 lg:grid-cols-3">
      <StageGuideCard
        v-for="(section, index) in sections"
        :key="section.title"
        :section="section"
        :index="index"
        :copied-command-id="copiedCommandId"
        @copy="copyCommand"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import StageGuideCard from "@/components/stage-guide/StageGuideCard.vue";
import StageGuideHero from "@/components/stage-guide/StageGuideHero.vue";
import StageHelpPanel from "@/components/stage-guide/StageHelpPanel.vue";
import { stageGuideSections as sections } from "@/components/stage-guide/stageGuideContent";
import { useStageCommandClipboard } from "@/components/stage-guide/useStageCommandClipboard";

const homeHref = import.meta.env.BASE_URL;

const { copiedCommandId, copyCommand } = useStageCommandClipboard();
</script>
