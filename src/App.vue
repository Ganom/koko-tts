<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import InfoBox from "@/components/InfoBox.vue";
import VoiceBuilder from "@/components/VoiceBuilder.vue";
import IconPatternBackground from "@/components/IconPatternBackground.vue";
import IconBackgroundConfigurator from "@/components/IconBackgroundConfigurator.vue";
import { useAudio } from "@/composables/useAudio";
import { useVoiceStore } from "@/stores/voiceStore";

const voiceStore = useVoiceStore();
const audio = useAudio();

provide("audio", audio);

const backgroundConfig = ref({
  icons: [
    "Terminal",
    "Cpu",
    "Server",
    "Code",
    "Box",
    "Beaker",
    "Zap",
    "BarChart3",
    "Cloud",
    "Settings",
    "Smartphone",
    "Fingerprint",
    "Globe",
    "Mic",
    "Rocket",
    "ShieldCheck",
    "Signal",
    "Sparkles",
    "Wifi",
  ],
  iconSize: 40,
  gap: 40,
  opacity: 0.1,
  color: "#60a5fa",
  randomRotation: true,
  randomOpacity: true,
  randomColors: true,
  enableSlideAnimation: false,
  slideAnimationSpeed: 3.0,
  slideDirection: "right" as const,
});

onMounted(() => {
  voiceStore.loadVoices();
});
</script>

<template>
  <div class="min-h-screen font-expressway relative bg-gray-900">
    <IconPatternBackground v-bind="backgroundConfig" />
    <div class="relative z-10">
      <div class="min-h-screen">
        <div class="container mx-auto px-6 py-8 max-w-7xl">
          <AppHeader />
          <InfoBox />
          <VoiceBuilder />

          <div v-if="voiceStore.isLoading" class="text-center">
            <div
              class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto shadow-glow"
            ></div>
            <p class="mt-4 text-gray-300">Loading voices...</p>
          </div>

          <div
            v-else-if="voiceStore.error"
            class="bg-red-900 border-2 border-red-700 text-red-300 px-4 py-3 rounded max-w-4xl mx-auto"
          >
            <strong>Error:</strong> {{ voiceStore.error }}
          </div>
        </div>
      </div>
    </div>

    <IconBackgroundConfigurator v-model="backgroundConfig" class="fixed bottom-4 right-4 z-50" />
  </div>
</template>

<style scoped></style>
