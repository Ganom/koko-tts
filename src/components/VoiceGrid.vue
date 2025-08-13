<template>
  <div class="space-y-4">
    <div class="relative" v-motion="searchBarMotion">
      <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search voices..."
        class="w-full bg-dark-900/60 border border-primary-700/40 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:border-primary-500/60 transition-colors"
        @focus="onSearchFocus"
        @blur="onSearchBlur"
      />
    </div>

    <div
      class="voice-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pr-2 justify-items-center sm:justify-items-stretch"
      @wheel="handleWheel"
      @mousedown.prevent
      v-motion="gridMotion"
    >
      <div
        v-for="voice in filteredVoices"
        :key="voice.name"
        :class="getVoiceCardClasses(voice)"
        v-motion="{
          key: `voice-${voice.name}`,
          initial: { opacity: 0, y: 10, scale: 0.95 },
          enter: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: 30, duration: 150, ease: 'easeOut' },
          },
          leave: { opacity: 0, scale: 0.9, transition: { duration: 150, ease: 'easeIn' } },
          hovered: { scale: 1.02, transition: { duration: 150 } },
        }"
        @mousedown.prevent
        @click="selectVoice(voice.name)"
      >
        <div class="relative mb-2">
          <img
            :src="`/icons/${voice.name.toLowerCase()}.webp`"
            :alt="`${voice.name} avatar`"
            class="voice-avatar w-20 h-20 rounded-full object-cover mx-auto transition-transform duration-200 group-hover:scale-110"
            :class="{
              'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100':
                selectedVoice !== voice.name,
            }"
          />
          <div v-if="selectedVoice === voice.name" class="absolute -top-1 -right-1">
            <CheckCircleIcon class="h-6 w-6 text-primary-400 bg-dark-800 rounded-full" />
          </div>
        </div>
        <p
          class="font-semibold text-white text-sm leading-tight mb-1 min-h-[2.5rem] flex items-center justify-center truncate px-1"
          :title="voice.name"
        >
          {{ voice.name }}
        </p>
        <p :class="getCostTextClasses(voice)">{{ voice.cost }} bits</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { computed, ref } from "vue";
import type { Voice } from "@/types/voice";

// --- PROPS & EMITS ---

interface Props {
  voices: Voice[];
  selectedVoice: string;
  currentBitAmount?: number;
}

interface Emits {
  (e: "update:selectedVoice", voiceName: string): void;
  (e: "change", isSearching: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// --- STATE ---

const searchQuery = ref("");
const searchFocused = ref(false);

// --- COMPUTED ---

const isSearching = computed(() => searchQuery.value.trim().length > 0 || searchFocused.value);

const filteredVoices = computed<Voice[]>(() => {
  let voicesToDisplay = [...props.voices];
  const query = searchQuery.value.toLowerCase().trim();

  if (query) {
    voicesToDisplay = voicesToDisplay.filter((voice) => voice.name.toLowerCase().includes(query));
  } else if (!isSearching.value && props.currentBitAmount !== undefined) {
    const bitAmount = props.currentBitAmount;
    voicesToDisplay = voicesToDisplay.filter((voice) => voice.cost <= bitAmount);
  }

  return voicesToDisplay;
});

// --- METHODS ---

const selectVoice = (voiceName: string) => {
  emit("update:selectedVoice", voiceName);
  emit("change", isSearching.value);
};

const onSearchFocus = () => {
  searchFocused.value = true;
};
const onSearchBlur = () => {
  setTimeout(() => {
    searchFocused.value = false;
  }, 100);
};

const handleWheel = (event: WheelEvent) => {
  const el = event.currentTarget as HTMLElement;
  const atTop = el.scrollTop === 0 && event.deltaY < 0;
  const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 1 && event.deltaY > 0;
  if (atTop || atBottom) {
    event.preventDefault();
  }
};

// --- DYNAMIC STYLING ---

const isUnaffordable = (voice: Voice) =>
  isSearching.value && props.currentBitAmount !== undefined && voice.cost > props.currentBitAmount;

const getVoiceCardClasses = (voice: Voice) => {
  const base =
    "group relative cursor-pointer rounded-lg border-2 p-4 text-center transition-all duration-200 m-2 sm:w-auto w-48";

  if (props.selectedVoice === voice.name) {
    return [base, "border-primary-500 bg-primary-500/20 scale-105 shadow-lg"];
  }
  if (isUnaffordable(voice)) {
    return [
      base,
      "border-yellow-600/50 bg-yellow-900/20 hover:border-yellow-500/70 hover:bg-yellow-800/30",
    ];
  }
  return [base, "border-dark-700 bg-dark-800/60 hover:border-primary-600/70 hover:bg-dark-700"];
};

const getCostTextClasses = (voice: Voice) => [
  "text-xs",
  isUnaffordable(voice) ? "text-yellow-300 font-semibold" : "text-primary-300",
];

const searchBarMotion = {
  initial: { opacity: 0, y: -20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { delay: 100, duration: 300, ease: "easeOut" },
  },
};

const gridMotion = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { delay: 150, duration: 300 } },
};
</script>

<style scoped>
.voice-grid {
  height: 350px;
  overflow-y: scroll;
  align-content: start;
}

@media (min-width: 640px) {
  .voice-grid {
    height: 600px;
  }
}

.voice-avatar {
  transform: scale(1.5);
}
</style>
