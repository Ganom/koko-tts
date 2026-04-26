<template>
  <article
    :class="[
      'stage-guide-card flex h-full flex-col overflow-hidden rounded-lg border-2',
      themeClasses[section.theme].border,
    ]"
    :aria-labelledby="`${section.id}-title`"
    v-motion="cardMotion"
  >
    <div
      :class="[
        'border-b px-5 py-3',
        themeClasses[section.theme].divider,
        themeClasses[section.theme].header,
      ]"
    >
      <div class="flex min-h-14 items-start justify-between gap-4">
        <div class="flex items-start gap-4">
          <div
            :class="[
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white',
              themeClasses[section.theme].icon,
            ]"
          >
            <component :is="section.icon" class="h-6 w-6" />
          </div>
          <div>
            <p
              :class="[
                'mb-2 inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider',
                themeClasses[section.theme].badge,
              ]"
            >
              {{ section.threshold }}
            </p>
            <h2 :id="`${section.id}-title`" class="text-2xl font-bold text-white">
              {{ section.title }}
            </h2>
          </div>
        </div>

        <div class="flex h-12 shrink-0 items-center gap-2">
          <img
            v-for="emote in section.emotes"
            :key="emote.alt"
            :src="emote.src"
            :alt="emote.alt"
            class="h-11 w-11 object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <div class="space-y-3">
        <StageCommandBlock
          v-for="command in section.commands"
          :key="command.id"
          :command="command"
          :is-copied="copiedCommandId === command.id"
          :theme="section.theme"
          @copy="emit('copy', $event)"
        />
      </div>

      <ul class="mt-5 space-y-3">
        <li
          v-for="detail in section.details"
          :key="detail"
          class="grid grid-cols-[auto_1fr] gap-3 text-sm font-medium text-gray-200"
        >
          <CheckCircle2 :class="['mt-0.5 h-5 w-5 shrink-0', themeClasses[section.theme].text]" />
          <span>{{ detail }}</span>
        </li>
      </ul>

      <div class="mt-auto pt-8">
        <div :class="['rounded-lg border px-4 py-3 text-sm', themeClasses[section.theme].note]">
          <p class="font-bold text-white">{{ section.note.title }}</p>
          <p class="mt-1 text-gray-300">{{ section.note.text }}</p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CheckCircle2 } from "lucide-vue-next";
import StageCommandBlock from "./StageCommandBlock.vue";
import { getStageGuideCardMotion } from "./stageGuideMotions";
import { stageGuideThemeClasses as themeClasses } from "./stageGuideTheme";
import type { StageGuideCommand, StageGuideSection } from "./types";

const props = defineProps<{
  section: StageGuideSection;
  index: number;
  copiedCommandId: string | null;
}>();

const emit = defineEmits<{
  copy: [command: StageGuideCommand];
}>();

const cardMotion = computed(() => getStageGuideCardMotion(props.section, props.index));
</script>

<style scoped>
.stage-guide-card {
  background: color-mix(in srgb, var(--theme-gray-900) 88%, var(--theme-dark-950));
  backdrop-filter: blur(10px);
  box-shadow:
    0 22px 30px color-mix(in srgb, var(--theme-dark-950) 55%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--theme-gray-100) 8%, transparent);
}
</style>
