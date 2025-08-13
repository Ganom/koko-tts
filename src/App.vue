<script setup lang="ts">
import { onMounted, provide } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import InfoBox from "@/components/InfoBox.vue";
import VoiceBuilder from "@/components/VoiceBuilder.vue";
import { useAudio } from "@/composables/useAudio";
import { useVoiceStore } from "@/stores/voiceStore";

const voiceStore = useVoiceStore();
const audio = useAudio();

provide("audio", audio);

onMounted(() => {
  voiceStore.loadVoices();
});
</script>

<template>
  <div class="min-h-screen font-expressway">
    <div class="container mx-auto px-6 py-8 max-w-7xl">
      <AppHeader/>
      <InfoBox/>
      <VoiceBuilder/>

      <div v-if="voiceStore.isLoading" class="text-center">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto shadow-glow"></div>
        <p class="mt-4 text-gray-300">Loading voices...</p>
      </div>

      <div v-else-if="voiceStore.error"
           class="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded max-w-4xl mx-auto">
        <strong>Error:</strong> {{ voiceStore.error }}
      </div>
    </div>
  </div>
</template>
