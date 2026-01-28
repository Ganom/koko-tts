<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
  }>(),
  { title: "" },
);
</script>

<template>
  <div>
    <label v-if="title" class="block text-white font-bold mb-3">{{ title }}</label>
    <div v-else-if="$slots.title" class="block text-white font-bold mb-3">
      <slot name="title" />
    </div>
    <slot />
  </div>
</template>
