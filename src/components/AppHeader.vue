<template>
  <header class="text-center mb-16 relative">
    <!-- Theme Selector positioned at top right -->
    <div class="absolute top-0 right-0 z-10">
      <ThemeSelector />
    </div>

    <h1 class="text-4xl md:text-6xl font-bold text-gradient mb-4 animate-float">
      Koko TTS Voices
    </h1>
    <!-- Decorative elements -->
    <div class="flex justify-center mt-8 space-x-3">
      <div class="w-3 h-3 bg-primary-500 rounded-full"/>
      <div class="w-3 h-3 bg-secondary-500 rounded-full"/>
      <div class="w-3 h-3 bg-accent-400 rounded-full"/>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeSelector from './ThemeSelector.vue'
</script>
