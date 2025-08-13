import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {Voice, VoiceMap, VoiceSection} from '@/types/voice';

// A constant for the premium cost threshold
const PREMIUM_COST_THRESHOLD = 1000;

export const useVoiceStore = defineStore('voice', () => {
  // --- STATE ---

  const voices = ref<Voice[]>([]);
  const minCost = ref(100);
  const maxCost = ref(5000);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const searchQuery = ref('');
  const showPremiumOnly = ref(false);

  // --- GETTERS & SELECTORS ---

  const voicesMap = computed(() =>
    new Map(voices.value.map(voice => [voice.name, voice]))
  );

  const getVoiceByName = computed(() => {
    return (name: string): Voice | undefined => voicesMap.value.get(name);
  });

  const filteredVoices = computed<Voice[]>(() => {
    const query = searchQuery.value.toLowerCase().trim();

    return voices.value.filter(voice => {
      if (showPremiumOnly.value && voice.cost < PREMIUM_COST_THRESHOLD) {
        return false;
      }
      if (query && !voice.name.toLowerCase().includes(query) && !voice.text.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  });

  const voiceSections = computed<VoiceSection[]>(() => {
    if (!filteredVoices.value.length) return [];

    const grouped = filteredVoices.value.reduce((acc, voice) => {
      const key = voice.cost >= PREMIUM_COST_THRESHOLD ? 'Premium Voices' : `${voice.cost} Bits`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(voice);
      return acc;
    }, {} as Record<string, Voice[]>);

    return Object.entries(grouped)
      .map(([title, voices]) => ({
        title,
        voices: voices.sort((a, b) => a.name.localeCompare(b.name)),
        isPremium: title === 'Premium Voices',
      }))
      .sort((a, b) => {
        if (a.isPremium) return -1;
        if (b.isPremium) return 1;
        return parseInt(b.title) - parseInt(a.title);
      });
  });

  // --- ACTIONS ---

  const loadVoices = async (): Promise<void> => {
    if (voices.value.length > 0) return;

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/voices.json');
      if (!response.ok) {
        throw new Error(`Failed to load voices: ${response.status}`);
      }

      const voiceMap: VoiceMap = await response.json();
      const loadedVoices = Object.entries(voiceMap).map(([name, data]) => ({name, ...data}));

      voices.value = loadedVoices;

      if (loadedVoices.length > 0) {
        const costs = loadedVoices.map(v => v.cost);
        minCost.value = Math.min(...costs);
        maxCost.value = Math.max(...costs);
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Failed to load voices:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    voices,
    isLoading,
    error,
    searchQuery,
    showPremiumOnly,
    minCost,
    maxCost,
    // Getters
    filteredVoices,
    voiceSections,
    getVoiceByName,
    // Actions
    loadVoices,
  };
});
