import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import type {GroupedVoices, Voice, VoiceMap, VoiceSection} from '@/types/voice'

export const useVoiceStore = defineStore('voice', () => {
  const voices = ref<Voice[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const showPremiumOnly = ref(false)

  const loadVoices = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/voices.json')
      if (!response.ok) {
        throw new Error(`Failed to load voices: ${response.status}`)
      }

      const voiceMap: VoiceMap = await response.json()
      voices.value = Object.entries(voiceMap).map(([name, data]) => ({
        name,
        ...data
      }))
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      console.error('Failed to load voices:', err)
    } finally {
      isLoading.value = false
    }
  }

  const filteredVoices = computed<Voice[]>(() => {
    let result = voices.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(voice =>
        voice.name.toLowerCase().includes(query) ||
        voice.text.toLowerCase().includes(query)
      )
    }

    if (showPremiumOnly.value) {
      result = result.filter(voice => voice.cost >= 1000)
    }

    return result
  })

  const voiceSections = computed<VoiceSection[]>(() => {
    const grouped: GroupedVoices = {}
    const premium: Voice[] = []

    filteredVoices.value.forEach(voice => {
      if (voice.cost >= 1000) {
        premium.push(voice)
      } else {
        if (!grouped[voice.cost]) {
          grouped[voice.cost] = []
        }
        grouped[voice.cost].push(voice)
      }
    })

    const sections: VoiceSection[] = []

    if (premium.length > 0) {
      sections.push({
        title: 'Premium Voices',
        voices: premium.sort((a, b) => b.cost - a.cost),
        isPremium: true
      })
    }

    Object.entries(grouped)
      .sort(([a], [b]) => parseInt(b as string) - parseInt(a as string))
      .forEach(([cost, voiceList]) => {
        sections.push({
          title: `${cost} Bits`,
          voices: voiceList.sort((a: Voice, b: Voice) => a.name.localeCompare(b.name)),
          isPremium: false
        })
      })

    return sections
  })

  return {
    voices,
    isLoading,
    error,
    searchQuery,
    showPremiumOnly,
    filteredVoices,
    voiceSections,
    loadVoices
  }
})
