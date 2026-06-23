<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, provide, ref, watch } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import InfoBox from "@/components/InfoBox.vue";
import IconPatternBackground from "@/components/IconPatternBackground.vue";
import StageStreamGuide from "@/components/StageStreamGuide.vue";
import VoiceBuilder from "@/components/VoiceBuilder.vue";
import { useAudio } from "@/composables/useAudio";
import { useLocalStorage } from "@/composables/useLocalStorage";
import { useConfigStore } from "@/stores/configStore";
import { useVoiceStore } from "@/stores/voiceStore";
import { monkeyIcons } from "@/utils/iconRegistry";
import { audioKey } from "@/injectionKeys";

const voiceStore = useVoiceStore();
const configStore = useConfigStore();
const audio = useAudio();
const [isInfoBoxHidden, setIsInfoBoxHidden] = useLocalStorage<boolean>(
  "koko-tts-hide-infobox",
  false,
);

provide(audioKey, audio);

const normalizeRoutePath = () => {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathname = window.location.pathname;
  const routePath =
    basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) || "/" : pathname;

  return `/${routePath.replace(/^\/+|\/$/g, "")}`.replace(/^\/$/, "/");
};

const routePath = ref(normalizeRoutePath());
const isStageStreamRoute = computed(() => routePath.value === "/stage-stream");

const updateRoutePath = () => {
  routePath.value = normalizeRoutePath();
};

const loadHomeVoices = () => {
  if (!isStageStreamRoute.value && !voiceStore.voices.length && !voiceStore.isLoading) {
    voiceStore.loadVoices();
  }
};

// Dev-only configurator
const IconBackgroundConfigurator = import.meta.env.DEV
  ? defineAsyncComponent(() => import("@/components/IconBackgroundConfigurator.vue"))
  : null;

const backgroundConfig = ref({
  icons: monkeyIcons,
  iconSize: 40,
  gap: 40,
  opacity: 0.1,
  color: "#60a5fa",
  randomRotation: true,
  randomOpacity: true,
  randomColors: true,
  enableSlideAnimation: false,
  slideAnimationSpeed: 0.1,
  slideDirection: "right" as const,
});

onMounted(() => {
  updateRoutePath();
  // Config drives both the home builder/InfoBox and the stage guide.
  configStore.loadConfig();
  loadHomeVoices();
  window.addEventListener("popstate", updateRoutePath);
});

onUnmounted(() => {
  window.removeEventListener("popstate", updateRoutePath);
});

watch(isStageStreamRoute, () => {
  loadHomeVoices();
});
</script>

<template>
  <div class="min-h-screen font-expressway relative bg-dark-700/70">
    <IconPatternBackground v-bind="backgroundConfig" />
    <div class="relative z-10">
      <div class="min-h-screen">
        <div class="container mx-auto px-6 py-8 max-w-7xl">
          <StageStreamGuide v-if="isStageStreamRoute" />
          <template v-else>
            <AppHeader
              :is-info-hidden="isInfoBoxHidden"
              @toggle-info="setIsInfoBoxHidden(!isInfoBoxHidden)"
            />
            <InfoBox v-if="!isInfoBoxHidden" @hide="setIsInfoBoxHidden(true)" />
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
          </template>
        </div>
      </div>
    </div>

    <!-- Configuration Panel (dev only) -->
    <component
      v-if="IconBackgroundConfigurator"
      :is="IconBackgroundConfigurator"
      v-model="backgroundConfig"
      class="fixed bottom-4 right-4 z-50"
    />
  </div>
</template>

<style scoped></style>
