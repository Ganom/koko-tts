<template>
  <div>
    <div class="mb-2 flex items-center justify-between gap-3">
      <p class="text-xs font-bold uppercase tracking-wider text-gray-400">
        {{ command.label }}
      </p>
      <p
        v-if="command.threshold"
        :class="['rounded-lg border px-2 py-0.5 text-xs font-bold', themeClasses[theme].badge]"
      >
        {{ command.threshold }}
      </p>
    </div>
    <div
      :class="[
        'grid grid-cols-[1fr_auto] items-stretch overflow-hidden rounded-lg border-2 bg-dark-950/75 shadow-lg',
        themeClasses[theme].command,
      ]"
    >
      <code
        class="flex min-h-14 min-w-0 items-center whitespace-nowrap px-3 py-3 font-mono text-sm font-bold text-white md:text-sm"
      >
        {{ command.text }}
      </code>
      <button
        type="button"
        :aria-label="`Copy ${command.label.toLowerCase()}`"
        :class="[
          'inline-flex w-[5.25rem] items-center justify-center gap-1.5 border-l px-2 text-sm font-bold transition-colors',
          themeClasses[theme].copyButton,
        ]"
        @click="emit('copy', command)"
      >
        <Check v-if="isCopied" class="h-4 w-4" />
        <Copy v-else class="h-4 w-4" />
        <span>{{ isCopied ? "Copied" : "Copy" }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";
import { stageGuideThemeClasses as themeClasses } from "./stageGuideTheme";
import type { StageGuideCommand, StageGuideThemeName } from "./types";

defineProps<{
  command: StageGuideCommand;
  isCopied: boolean;
  theme: StageGuideThemeName;
}>();

const emit = defineEmits<{
  copy: [command: StageGuideCommand];
}>();
</script>
