<template>
  <div class="relative" ref="triggerRef">
    <button @click="toggle" :class="triggerClasses">
      <span :class="{ 'text-gray-400': !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronDownIcon
        class="w-5 h-5 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen && dropdownPosition"
        ref="contentRef"
        :style="dropdownStyle"
        class="bg-dark-800 border border-primary-700/40 rounded-lg shadow-xl max-h-64 overflow-y-auto"
        @mouseenter="isDropdownHovered = true"
        @mouseleave="isDropdownHovered = false"
        @wheel="handleDropdownWheel"
        @touchstart="handleDropdownTouch"
        @touchmove="handleDropdownTouch"
      >
        <div
          v-for="(option, index) in options"
          :key="option.value"
          :class="getOptionClasses(option, index)"
          @click="selectOption(option)"
          @mouseenter="highlightedIndex = index"
        >
          {{ option.label }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from "@heroicons/vue/24/solid";
import { computed, type CSSProperties, nextTick, onMounted, onUnmounted, ref } from "vue";

// --- TYPES ---
interface SelectOption {
  label: string;
  value: string | number;
}

// --- PROPS & EMITS ---
interface Props {
  modelValue: string | number;
  options: SelectOption[];
  placeholder?: string;
}

interface Emits {
  (e: "update:modelValue", value: string | number): void;

  (e: "change"): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select an option...",
});
const emit = defineEmits<Emits>();

// --- REFS & STATE ---

const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const dropdownPosition = ref<{
  top: number;
  left: number;
  width: number;
} | null>(null);
const highlightedIndex = ref(-1);
const isDropdownHovered = ref(false);

// --- COMPUTED ---

const selectedLabel = computed(() => {
  return props.options.find((option) => option.value === props.modelValue)?.label || "";
});

const triggerClasses = computed(() => [
  "w-full bg-dark-900/60 border border-primary-700/40 rounded-lg px-4 py-3 text-white",
  "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50",
  "hover:border-primary-500/60 transition-colors cursor-pointer text-left",
  "flex items-center justify-between",
]);

const dropdownStyle = computed<CSSProperties>(() => ({
  position: "fixed",
  top: `${dropdownPosition.value?.top ?? 0}px`,
  left: `${dropdownPosition.value?.left ?? 0}px`,
  width: `${dropdownPosition.value?.width ?? 0}px`,
  zIndex: 999999,
}));

// --- CORE LOGIC ---

const updateDropdownPosition = () => {
  const rect = triggerRef.value?.getBoundingClientRect();
  if (rect) {
    dropdownPosition.value = {
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    };
  }
};

const open = () => {
  isOpen.value = true;
  updateDropdownPosition();

  nextTick(() => {
    const currentIndex = props.options.findIndex((option) => option.value === props.modelValue);
    highlightedIndex.value = currentIndex > -1 ? currentIndex : 0;
    scrollToOption(highlightedIndex.value);
  });
};

const close = () => {
  isOpen.value = false;
  highlightedIndex.value = -1;
};

const toggle = () => {
  isOpen.value ? close() : open();
};

const selectOption = (option: SelectOption): void => {
  emit("update:modelValue", option.value);
  emit("change");
  close();
};

// --- KEYBOARD & SCROLL HANDLING ---

const scrollToOption = (index: number) => {
  const dropdown = contentRef.value;
  const optionEl = dropdown?.children[index] as HTMLElement;
  if (!dropdown || !optionEl) return;

  const dropdownRect = dropdown.getBoundingClientRect();
  const optionRect = optionEl.getBoundingClientRect();

  if (optionRect.bottom > dropdownRect.bottom) {
    dropdown.scrollTop += optionRect.bottom - dropdownRect.bottom;
  } else if (optionRect.top < dropdownRect.top) {
    dropdown.scrollTop -= dropdownRect.top - optionRect.top;
  }
};

const navigateOptions = (direction: "up" | "down") => {
  if (!props.options.length) return;

  const delta = direction === "down" ? 1 : -1;
  const newIndex = Math.max(0, Math.min(highlightedIndex.value + delta, props.options.length - 1));

  if (newIndex !== highlightedIndex.value) {
    highlightedIndex.value = newIndex;
    scrollToOption(newIndex);
    emit("update:modelValue", props.options[newIndex].value);
    emit("change");
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      navigateOptions("down");
      break;
    case "ArrowUp":
      event.preventDefault();
      navigateOptions("up");
      break;
    case "Enter":
      event.preventDefault();
      if (highlightedIndex.value > -1) {
        selectOption(props.options[highlightedIndex.value]);
      }
      break;
    case "Escape":
      event.preventDefault();
      close();
      break;
  }
};

const handleDropdownWheel = (event: WheelEvent) => {
  const dropdown = event.currentTarget as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = dropdown;
  const atTop = scrollTop === 0 && event.deltaY < 0;
  const atBottom = scrollHeight - scrollTop <= clientHeight + 1 && event.deltaY > 0;

  if (atTop || atBottom) {
    event.preventDefault();
  }
};

const handleDropdownTouch = (event: TouchEvent) => {
  event.stopPropagation();
};

// --- DYNAMIC STYLING ---

const getOptionClasses = (option: SelectOption, index: number) => {
  const isSelected = option.value === props.modelValue;
  const isHighlighted = index === highlightedIndex.value;
  return [
    "px-4 py-3 text-white hover:bg-primary-600/20 cursor-pointer",
    "transition-colors border-b border-primary-700/20 last:border-b-0",
    {
      "bg-primary-600/30": isSelected,
      "bg-primary-500/15": isHighlighted && !isSelected,
    },
  ];
};

// --- GLOBAL EVENT LISTENERS ---

const handleClickOutside = (event: MouseEvent) => {
  if (
    triggerRef.value &&
    !triggerRef.value.contains(event.target as Node) &&
    !contentRef.value?.contains(event.target as Node)
  ) {
    close();
  }
};

const handlePageScroll = (event: Event) => {
  if (isOpen.value && !isDropdownHovered.value && event instanceof WheelEvent) {
    close();
  }

  if (isOpen.value) {
    updateDropdownPosition();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("click", handleClickOutside, true);
  document.addEventListener("wheel", handlePageScroll, true);
  document.addEventListener("scroll", handlePageScroll, true);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("click", handleClickOutside, true);
  document.removeEventListener("wheel", handlePageScroll, true);
  document.removeEventListener("scroll", handlePageScroll, true);
});
</script>
