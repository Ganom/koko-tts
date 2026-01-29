<script setup lang="ts">
interface ButtonOption {
  value: string | number;
  label: string;
  detail?: string;
  theme: string;
}

interface Props {
  modelValue: string | number;
  options: ButtonOption[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const getBgClass = (theme: string) => {
  switch (theme) {
    case "primary":
      return "bg-primary-600";
    case "secondary":
      return "bg-secondary-600";
    case "accent":
      return "bg-accent-500";
    default:
      return "bg-primary-600";
  }
};

const getBorderClass = (theme: string) => {
  switch (theme) {
    case "primary":
      return "border-primary-500/40";
    case "secondary":
      return "border-secondary-500/40";
    case "accent":
      return "border-accent-500/40";
    default:
      return "border-primary-500/40";
  }
};

const getTextClass = (theme: string) => {
  switch (theme) {
    case "primary":
      return "text-sm text-primary-300";
    case "secondary":
      return "text-sm text-secondary-300";
    case "accent":
      return "text-sm text-accent-300";
    default:
      return "text-sm text-primary-300";
  }
};

const getButtonClasses = (opt: ButtonOption, isSelected: boolean) => {
  const baseClasses =
    "p-3 rounded-lg border-2 text-white font-medium transition-colors text-center";
  const bgClasses = isSelected ? getBgClass(opt.theme) : "bg-dark-700 hover:bg-dark-600";
  const borderClasses = getBorderClass(opt.theme);
  return `${baseClasses} ${bgClasses} ${borderClasses}`;
};

const onClick = (value: string | number) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      :class="getButtonClasses(opt, props.modelValue === opt.value)"
      @click="onClick(opt.value)"
    >
      {{ opt.label }}
      <br v-if="opt.detail" />
      <span v-if="opt.detail" :class="getTextClass(opt.theme)">{{ opt.detail }}</span>
    </button>
  </div>
</template>
