<template>
  <div class="space-y-3">
    <div class="relative" v-motion="searchBarMotion">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search voices..."
        class="w-full bg-dark-900/60 border-2 border-secondary-500/40 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 hover:border-secondary-500/60 transition-colors"
        @focus="onSearchFocus"
        @blur="onSearchBlur"
      />
    </div>

    <div class="relative">
      <button
        type="button"
        aria-label="Scroll voices left"
        class="carousel-arrow left-0 -translate-x-1/2"
        @click="scrollByDir(-1)"
      >
        <ChevronLeft class="h-5 w-5" />
      </button>

      <div
        ref="trackRef"
        class="voice-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 py-2"
        @wheel="handleWheel"
      >
        <div
          v-for="voice in filteredVoices"
          :key="voice.name"
          class="voice-card snap-start shrink-0"
        >
          <button
            type="button"
            :class="getCardClasses(voice)"
            @click="selectVoice(voice.name)"
            :title="getVoiceTitle(voice)"
          >
            <div
              v-if="voice.kind === 'random' || voice.priority || isNew(voice)"
              class="absolute top-1.5 left-1.5 z-10 flex flex-col items-start gap-1"
            >
              <span
                v-if="isNew(voice)"
                class="flex items-center gap-0.5 rounded-full bg-emerald-900/70 border border-emerald-400/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-200"
              >
                <Sparkles class="h-2.5 w-2.5" />New
              </span>
              <span
                v-if="voice.kind === 'random'"
                class="rounded-full bg-secondary-900/70 border border-secondary-500/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-secondary-200"
                >Pseudo</span
              >
              <span
                v-if="voice.priority"
                class="rounded-full bg-accent-900/70 border border-accent-500/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-200"
                >Priority</span
              >
            </div>

            <div class="relative mb-2 flex h-24 w-24 items-center justify-center">
              <div
                v-if="voice.kind === 'random'"
                class="flex h-24 w-24 items-center justify-center rounded-full bg-dark-900/50 border border-secondary-500/40"
                aria-hidden="true"
              >
                <Dices class="h-10 w-10 text-secondary-200" />
              </div>
              <div v-else class="h-24 w-24 overflow-hidden rounded-full">
                <img
                  :src="`/icons/${voice.name.toLowerCase()}.webp`"
                  :alt="`${voice.name} avatar`"
                  loading="lazy"
                  decoding="async"
                  class="h-24 w-24 rounded-full object-cover"
                  :class="{ 'grayscale opacity-60': !isSelected(voice) }"
                  style="transform: scale(1.4)"
                />
              </div>
              <CheckCircle
                v-if="isSelected(voice)"
                class="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-dark-800 text-primary-400"
              />
            </div>

            <p class="w-full truncate px-1 text-sm font-semibold leading-tight text-white">
              {{ voice.name }}
            </p>
            <p :class="getCostTextClasses(voice)">{{ getCostLabel(voice) }}</p>
          </button>

          <div v-if="voice.kind !== 'random'" class="mt-2 flex justify-center" @click.stop>
            <AudioPlayerSquare :voice-name="voice.name" />
          </div>
        </div>

        <div
          v-if="!filteredVoices.length"
          class="flex h-32 w-full items-center justify-center text-sm text-gray-500"
        >
          No voices match "{{ searchQuery }}".
        </div>
      </div>

      <button
        type="button"
        aria-label="Scroll voices right"
        class="carousel-arrow right-0 translate-x-1/2"
        @click="scrollByDir(1)"
      >
        <ChevronRight class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, ChevronLeft, ChevronRight, Dices, Search, Sparkles } from "@lucide/vue";
import { computed, nextTick, onMounted, ref } from "vue";
import { isNewVoice } from "@/domain/voiceBadges";
import type { Voice } from "@/types/voice";
import AudioPlayerSquare from "./AudioPlayerSquare.vue";

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

// Evaluated once per mount; newness auto-expires on the next page load.
const now = new Date();
const isNew = (voice: Voice) => isNewVoice(voice.addedAt, now);

const trackRef = ref<HTMLElement | null>(null);
const searchQuery = ref("");
const searchFocused = ref(false);

const isSearching = computed(() => searchQuery.value.trim().length > 0 || searchFocused.value);

const filteredVoices = computed<Voice[]>(() => {
  const query = searchQuery.value.toLowerCase().trim();

  if (query) {
    return props.voices.filter((voice) => voice.name.toLowerCase().includes(query));
  }
  if (!isSearching.value && props.currentBitAmount !== undefined) {
    const budget = props.currentBitAmount;
    return props.voices.filter((voice) => voice.cost <= budget || isNew(voice));
  }
  return [...props.voices];
});

// selection
const isSelected = (voice: Voice) => props.selectedVoice === voice.name;

const selectVoice = (voiceName: string) => {
  emit("update:selectedVoice", voiceName);
  emit("change", isSearching.value);
};

// scrolling
const scrollByDir = (direction: number) => {
  const el = trackRef.value;
  if (!el) return;
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
};

// Center the currently-picked voice when the carousel opens, so re-opening a
// line lands on the voice it's already using rather than the top of the list.
const scrollToSelected = () => {
  const el = trackRef.value;
  if (!el) return;
  const index = filteredVoices.value.findIndex(isSelected);
  if (index < 0) return;
  const card = el.children[index] as HTMLElement | undefined;
  if (!card) return;
  const cardRect = card.getBoundingClientRect();
  const trackRect = el.getBoundingClientRect();
  el.scrollLeft += cardRect.left - trackRect.left - (el.clientWidth - cardRect.width) / 2;
};

onMounted(() => {
  nextTick(scrollToSelected);
});

const handleWheel = (event: WheelEvent) => {
  const el = trackRef.value;
  if (!el || event.deltaY === 0) return;
  const atStart = el.scrollLeft <= 0 && event.deltaY < 0;
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && event.deltaY > 0;
  if (atStart || atEnd) return; // let the page scroll at the edges
  el.scrollLeft += event.deltaY;
  event.preventDefault();
};

const onSearchFocus = () => {
  searchFocused.value = true;
};
const onSearchBlur = () => {
  setTimeout(() => {
    searchFocused.value = false;
  }, 100);
};

// styling

const isUnaffordable = (voice: Voice) =>
  isSearching.value && props.currentBitAmount !== undefined && voice.cost > props.currentBitAmount;

const getCardClasses = (voice: Voice) => {
  const base =
    "group relative flex w-36 cursor-pointer flex-col items-center rounded-xl border-2 p-3 text-center transition-all duration-200";
  if (isSelected(voice)) return [base, "border-primary-500 bg-primary-500/20 shadow-lg"];
  if (isUnaffordable(voice))
    return [base, "border-yellow-600/50 bg-yellow-900/20 hover:border-yellow-500/70"];
  if (voice.kind === "random")
    return [base, "border-secondary-600/60 bg-secondary-900/10 hover:border-secondary-500/80"];
  return [base, "border-dark-700 bg-dark-800/60 hover:border-primary-600/70 hover:bg-dark-700"];
};

const getCostTextClasses = (voice: Voice) => [
  "text-xs",
  isUnaffordable(voice) ? "text-yellow-300 font-semibold" : "text-primary-300",
];

const getCostLabel = (voice: Voice) =>
  voice.kind === "random" ? `${voice.cost}+ bits` : `${voice.cost} bits`;

const getVoiceTitle = (voice: Voice) => {
  if (voice.kind === "random") return "Random (chooses an eligible voice)";
  if (voice.priority) return `${voice.name} (redeem priority: higher spot in the redeem queue)`;
  return voice.name;
};

const searchBarMotion = {
  initial: { opacity: 0, y: -10 },
  enter: { opacity: 1, y: 0, transition: { duration: 250, ease: "easeOut" } },
};
</script>

<style scoped>
.voice-carousel {
  scrollbar-width: thin;
  scrollbar-color: var(--theme-primary-600) transparent;
}
.voice-carousel::-webkit-scrollbar {
  height: 6px;
}
.voice-carousel::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--theme-primary-600) 70%, transparent);
  border-radius: 9999px;
}

.carousel-arrow {
  position: absolute;
  top: calc(50% - 0.75rem);
  z-index: 20;
  display: flex;
  height: 2.25rem;
  width: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 2px solid color-mix(in srgb, var(--theme-primary-500) 40%, transparent);
  background: color-mix(in srgb, var(--theme-dark-900) 85%, transparent);
  color: white;
  backdrop-filter: blur(4px);
  transition: background-color 150ms;
}
.carousel-arrow:hover {
  background: color-mix(in srgb, var(--theme-primary-600) 80%, transparent);
}
</style>
