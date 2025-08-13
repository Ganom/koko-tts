import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import type {Voice, VoiceMap} from '@/types/voice';


export const useVoiceStore = defineStore('voice', () => {
  // --- STATE ---

  const voices = ref<Voice[]>([]);
  const minCost = ref(100);
  const maxCost = ref(5000);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const searchQuery = ref('');

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
      return !(query && !voice.name.toLowerCase().includes(query) && !voice.text.toLowerCase().includes(query));
    });
  });

  const sortedVoices = computed<Voice[]>(() => {
    return filteredVoices.value.sort((a, b) => {
      const costDiff = b.cost - a.cost;
      if (costDiff !== 0) return costDiff;
      return a.name.localeCompare(b.name);
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
    minCost,
    maxCost,
    // Getters
    filteredVoices,
    sortedVoices,
    getVoiceByName,
    // Actions
    loadVoices,
  };
});
