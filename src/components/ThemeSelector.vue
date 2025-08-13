<template>
  <div class="theme-selector" ref="triggerRef">
    <button
      @click="toggle"
      class="flex items-center space-x-2 px-4 py-2 bg-dark-800 border border-primary-600/40 rounded-lg hover:border-primary-500 transition-colors"
    >
      <ThemePalette :theme="themes[currentTheme]"/>
      <span class="text-white text-sm font-medium">{{ themes[currentTheme].name }}</span>
      <ChevronDownIcon
        class="w-4 h-4 text-gray-400 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        :style="dropdownStyle"
        class="bg-dark-800 border border-primary-600/40 rounded-lg shadow-xl overflow-hidden"
      >
        <button
          v-for="(theme, key) in themes"
          :key="key"
          @click="selectTheme(key as Theme)"
          class="w-full flex items-center space-x-3 px-4 py-3 hover:bg-primary-600/10 transition-colors border-b border-primary-600/20 last:border-b-0"
          :class="{ 'bg-primary-600/20': currentTheme === key }"
        >
          <ThemePalette :theme="theme"/>
          <span class="text-white text-sm font-medium">{{ theme.name }}</span>
          <CheckIcon v-if="currentTheme === key" class="w-4 h-4 text-primary-400 ml-auto"/>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from "@heroicons/vue/24/solid";
import type { CSSProperties, PropType, Ref } from "vue";
import { computed, defineComponent, h, onMounted, onUnmounted, ref } from "vue";
import { type Theme, useTheme } from "@/composables/useTheme";

// --- THEME LOGIC ---

const { currentTheme, themes, setTheme } = useTheme();

// --- DROPDOWN LOGIC ---

const triggerRef = ref<HTMLElement>();
const { isOpen, dropdownPosition, toggle, close } = useDropdown(triggerRef);

const selectTheme = (theme: Theme) => {
  setTheme(theme);
  close();
};

// --- COMPUTED STYLES ---

const dropdownStyle = computed<CSSProperties>(() => ({
  position: "fixed",
  top: `${dropdownPosition.value?.top ?? 0}px`,
  left: `${dropdownPosition.value?.left ?? 0}px`,
  width: `${dropdownPosition.value?.width ?? 0}px`,
  zIndex: 999999,
}));

// --- LOCAL SUB-COMPONENTS ---

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

// --- REUSABLE COMPOSABLES ---

function useDropdown(triggerRef: Ref<HTMLElement | undefined>) {
  const isOpen = ref(false);
  const dropdownPosition = ref<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const updatePosition = () => {
    if (triggerRef.value) {
      const rect = triggerRef.value.getBoundingClientRect();
      dropdownPosition.value = {
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      };
    }
  };

  const open = () => {
    isOpen.value = true;
    updatePosition();
  };

  const close = () => {
    isOpen.value = false;
  };

  const toggle = () => {
    isOpen.value ? close() : open();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (triggerRef.value && !triggerRef.value.contains(event.target as Node)) {
      close();
    }
  };

  onMounted(() => document.addEventListener("click", handleClickOutside));
  onUnmounted(() => document.removeEventListener("click", handleClickOutside));

  return { isOpen, dropdownPosition, toggle, close };
}
</script>
