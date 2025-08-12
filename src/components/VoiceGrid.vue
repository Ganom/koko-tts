<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <div class="relative">
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search voices..."
        class="w-full bg-dark-900/60 border border-primary-700/40 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:border-primary-500/60 transition-colors"
      >
    </div>

    <!-- Voice Grid -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pr-2"
      style="height: 525px; overflow-y: scroll;"
      @wheel="handleWheel"
    >
    <div
      v-for="voice in filteredVoices"
      :key="voice.name"
      @click="selectVoice(voice.name)"
      :class="[
        'group relative cursor-pointer rounded-lg border-2 p-4 text-center transition-all duration-200 m-1',
        selectedVoice === voice.name
          ? 'border-primary-500 bg-primary-500/20 scale-105 shadow-lg'
          : 'border-dark-700 bg-dark-800/60 hover:border-primary-600/70 hover:bg-dark-700'
      ]"
    >
      <div class="relative mb-2">
        <img
          :src="`/icons/${voice.name.toLowerCase()}.webp`"
          :alt="`${voice.name} avatar`"
          class="w-20 h-20 rounded-full object-cover mx-auto transition-transform duration-200 group-hover:scale-110"
          :class="{ 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100': selectedVoice !== voice.name }"
          style="transform: scale(1.5);"
        >
        <div v-if="selectedVoice === voice.name" class="absolute -top-1 -right-1">
          <CheckCircleIcon class="h-6 w-6 text-primary-400 bg-dark-800 rounded-full" />
        </div>
      </div>
      <p class="font-semibold text-white text-sm leading-tight mb-1 min-h-[2.5rem] flex items-center justify-center truncate px-1" :title="voice.name">{{ voice.name }}</p>
      <p class="text-xs text-primary-300">{{ voice.cost }} bits</p>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckCircleIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import type { Voice } from '@/types/voice';

interface Props {
  voices: Voice[];
  selectedVoice: string;
}

interface Emits {
  (e: 'update:selectedVoice', voiceName:string): void;
  (e: 'change'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const searchQuery = ref<string>('')

const filteredVoices = computed<Voice[]>(() => {
  if (!searchQuery.value.trim()) {
    return props.voices
  }

  const query = searchQuery.value.toLowerCase().trim()
  return props.voices.filter(voice =>
    voice.name.toLowerCase().includes(query)
  )
})

const selectVoice = (voiceName: string) => {
  emit('update:selectedVoice', voiceName);
  emit('change');
};

const handleWheel = (event: WheelEvent) => {
  const element = event.currentTarget as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = element;

  // Check if we are at the top and scrolling up
  const atTop = scrollTop === 0 && event.deltaY < 0;

  // Check if we are at the bottom and scrolling down
  // A small buffer (e.g., 1) is added for pixel-perfect precision issues
  const atBottom = scrollHeight - scrollTop <= clientHeight + 1 && event.deltaY > 0;

  if (atTop || atBottom) {
    event.preventDefault();
  }
};
</script>
