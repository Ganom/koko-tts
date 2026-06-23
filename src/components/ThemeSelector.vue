<template>
  <div class="theme-selector" ref="triggerRef">
    <button
      @click="toggle"
      class="flex items-center space-x-2 px-4 py-2 bg-dark-800 border-2 border-primary-600/40 rounded-lg hover:border-primary-500 transition-colors"
    >
      <ThemePalette :theme="themes[currentTheme]" />
      <span class="text-white text-sm font-medium">{{ themes[currentTheme].name }}</span>
      <ChevronDown
        class="w-4 h-4 text-gray-400 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="contentRef"
        :style="dropdownStyle"
        class="bg-dark-800 border-2 border-primary-600/40 rounded-lg shadow-xl overflow-hidden"
      >
        <button
          v-for="(theme, key) in themes"
          :key="key"
          @click="selectTheme(key as Theme)"
          class="w-full flex items-center space-x-3 px-4 py-3 hover:bg-primary-600/10 transition-colors border-b border-primary-600/20 last:border-b-0"
          :class="{ 'bg-primary-600/20': currentTheme === key }"
        >
          <ThemePalette :theme="theme" />
          <span class="text-white text-sm font-medium">{{ theme.name }}</span>
          <Check v-if="currentTheme === key" class="w-4 h-4 text-primary-400 ml-auto" />
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Check, ChevronDown } from "@lucide/vue";
import type { PropType } from "vue";
import { computed, defineComponent, h, ref } from "vue";
import { useFloatingDropdown } from "@/composables/useFloatingDropdown";
import { type Theme, useTheme } from "@/composables/useTheme";

// theme
const { currentTheme, themes, setTheme } = useTheme();

// dropdown
const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const { isOpen, toggle, close, dropdownStyle } = useFloatingDropdown(triggerRef, contentRef);

const selectTheme = (theme: Theme) => {
  setTheme(theme);
  close();
};

// local sub-components
const ThemePalette = defineComponent({
  props: {
    theme: {
      type: Object as PropType<(typeof themes)[keyof typeof themes]>,
      required: true,
    },
  },
  setup(props) {
    const colors = computed(() => props.theme.colors);
    return () =>
      h("div", { class: "flex space-x-1" }, [
        h("div", {
          class: "w-3 h-3 rounded-full",
          style: { backgroundColor: colors.value.primary },
        }),
        h("div", {
          class: "w-3 h-3 rounded-full",
          style: { backgroundColor: colors.value.secondary },
        }),
        h("div", {
          class: "w-3 h-3 rounded-full",
          style: { backgroundColor: colors.value.accent },
        }),
      ]);
  },
});
</script>
