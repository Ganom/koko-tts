<template>
  <div class="max-w-6xl mx-auto mb-16">
    <div
      class="anime-card bg-gradient-dark rounded-4xl p-8 border border-violet-700/30">
      <div class="text-center mb-8">
        <h2 class="text-gradient text-3xl font-bold mb-3">Voice Message Builder</h2>
        <p class="text-gray-300 text-lg">Build and preview your TTS command</p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Form Section -->
        <div class="space-y-6">
          <!-- Redeem Method -->
          <div>
            <label class="block text-white font-bold mb-3">Redeem Method</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                @click="() => { redeemMethod = 'cheer'; checkVoiceEligibility() }"
                :class="redeemMethod === 'cheer' ? 'bg-violet-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-violet-700/40 text-white font-medium transition-colors"
              >
                Cheer
              </button>
              <button
                @click="() => { redeemMethod = 'points'; checkVoiceEligibility() }"
                :class="redeemMethod === 'points' ? 'bg-pink-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-pink-700/40 text-white font-medium transition-colors"
              >
                Channel Points
              </button>
              <button
                @click="() => { redeemMethod = 'resub'; checkVoiceEligibility() }"
                :class="redeemMethod === 'resub' ? 'bg-gold-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-gold-700/40 text-white font-medium transition-colors"
              >
                Resub
              </button>
            </div>
          </div>

          <!-- Bit Amount (for Cheer) -->
          <div v-if="redeemMethod === 'cheer'">
            <label class="block text-white font-bold mb-3">Bit Amount</label>
            <input
              v-model.number="bitAmount"
              type="number"
              :min="minBitAmount"
              :placeholder="minBitAmount.toString()"
              class="w-full bg-dark-900/60 border border-violet-700/40 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-violet-500/60 transition-colors"
            >
            <p v-if="selectedVoice && minBitAmount > 300" class="text-sm text-violet-300 mt-2">
              Minimum {{ minBitAmount }} bits for {{ selectedVoice }}
            </p>
            <p v-else-if="redeemMethod === 'cheer' && bitAmount" class="text-sm text-gray-400 mt-2">
              Voices up to {{ bitAmount }} bits available
            </p>
          </div>

          <!-- Resub Tier Selection -->
          <div v-if="redeemMethod === 'resub'">
            <label class="block text-white font-bold mb-3">Subscription Tier</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                @click="() => { resubTier = 1; checkVoiceEligibility() }"
                :class="resubTier === 1 ? 'bg-violet-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-violet-700/40 text-white font-medium transition-colors"
              >
                Tier 1<br><span class="text-sm text-violet-300">500 bits</span>
              </button>
              <button
                @click="() => { resubTier = 2; checkVoiceEligibility() }"
                :class="resubTier === 2 ? 'bg-pink-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-pink-700/40 text-white font-medium transition-colors"
              >
                Tier 2<br><span class="text-sm text-pink-300">1000 bits</span>
              </button>
              <button
                @click="() => { resubTier = 3; checkVoiceEligibility() }"
                :class="resubTier === 3 ? 'bg-gold-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-gold-700/40 text-white font-medium transition-colors"
              >
                Tier 3<br><span class="text-sm text-gold-300">2500 bits</span>
              </button>
            </div>
          </div>

          <!-- Voice Selection -->
          <div>
            <label class="block text-white font-bold mb-3">Select Voice</label>
            <CustomSelect
              v-model="selectedVoice"
              :options="voiceOptions"
              placeholder="Choose a voice..."
              @change="updateBitAmount"
            />
          </div>

          <!-- Message Input -->
          <div>
            <label class="block text-white font-bold mb-3">Your Message</label>
            <textarea
              v-model="message"
              placeholder="Enter your message here..."
              class="w-full bg-dark-900/60 border border-violet-700/40 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none resize-none"
              rows="3"
            ></textarea>
          </div>

          <!-- Advanced Options Toggle -->
          <div>
            <button
              @click="showAdvanced = !showAdvanced"
              class="flex items-center text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              <ChevronRightIcon
                class="w-4 h-4 mr-2 transition-transform duration-200"
                :class="{ 'rotate-90': showAdvanced }"
              />
              Advanced Options
            </button>
          </div>

          <!-- Advanced Options Panel -->
          <div v-if="showAdvanced"
               class="space-y-4 bg-dark-800/40 rounded-lg p-4 border border-violet-700/20 overflow-visible">
            <!-- Text Effect -->
            <div>
              <label class="block text-white font-semibold mb-2">Text Effect</label>
              <CustomSelect
                v-model="textEffect"
                :options="textEffectOptions"
              />
            </div>

            <!-- Model Selection -->
            <div>
              <label class="block text-white font-semibold mb-2">Voice Model</label>
              <CustomSelect
                v-model="selectedModel"
                :options="modelOptions"
              />
            </div>
          </div>
        </div>

        <!-- Preview Section -->
        <div class="space-y-6">
          <!-- Voice Avatar Preview -->
          <div v-if="selectedVoice" class="flex flex-col items-center text-center">
            <div class="relative">
              <img
                :src="`/icons/${selectedVoice.toLowerCase()}.webp`"
                :alt="`${selectedVoice} avatar`"
                class="w-32 h-32 rounded-full bg-dark-900/60 border-4 border-primary-500/40 shadow-primary object-cover mx-auto"
              >
            </div>
            <div class="mt-4">
              <h3 class="text-2xl font-bold text-white">{{ selectedVoice }}</h3>
              <p class="text-primary-300">{{ getVoiceCost(selectedVoice) }} bits</p>
            </div>
          </div>

          <!-- Command Preview -->
          <div class="glass rounded-2xl p-6 border border-violet-700/30">
            <h4 class="text-white font-bold mb-4 flex items-center">
              <Bars3Icon class="w-5 h-5 mr-2 text-violet-400" />
              Command Preview
            </h4>
            <div
              class="bg-dark-900/50 border border-violet-700/20 rounded-lg p-4 font-mono text-sm">
              <div v-if="generatedCommand" class="text-green-400">
                {{ generatedCommand }}
              </div>
              <div v-else class="text-gray-500 italic">
                Configure your voice message to see the command preview
              </div>
            </div>
          </div>

          <!-- Copy Button -->
          <div v-if="generatedCommand">
            <button
              @click="copyCommand"
              class="w-full bg-gradient-dark hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-secondary-600/20 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center border border-primary-600/40 hover:border-primary-500/60"
            >
              <CheckIcon v-if="copied" class="w-5 h-5 mr-2" />
              <ClipboardIcon v-else class="w-5 h-5 mr-2" />
              {{ copied ? 'Copied!' : 'Copy Command' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import {useVoiceStore} from '@/stores/voiceStore'
import type {Voice} from '@/types/voice'
import CustomSelect from './CustomSelect.vue'
import {useLocalStorage} from '@/composables/useLocalStorage'
import { ChevronRightIcon, Bars3Icon, CheckIcon, ClipboardIcon } from '@heroicons/vue/24/solid'

const voiceStore = useVoiceStore()

// Settings interface
interface VoiceBuilderSettings {
  selectedVoice: string
  redeemMethod: 'cheer' | 'points' | 'resub'
  bitAmount: number
  resubTier: 1 | 2 | 3
  showAdvanced: boolean
  textEffect: string
  selectedModel: string
}

// Default settings
const defaultSettings: VoiceBuilderSettings = {
  selectedVoice: '',
  redeemMethod: 'cheer',
  bitAmount: 300,
  resubTier: 1,
  showAdvanced: false,
  textEffect: 'none',
  selectedModel: 'none'
}

// Load/save settings from localStorage
const [settings] = useLocalStorage('voiceBuilderSettings', defaultSettings)

// Form state - initialize from saved settings
const selectedVoice = ref<string>(settings.value.selectedVoice)
const message = ref<string>('')
const redeemMethod = ref<'cheer' | 'points' | 'resub'>(settings.value.redeemMethod)
const bitAmount = ref<number>(settings.value.bitAmount)
const resubTier = ref<1 | 2 | 3>(settings.value.resubTier)
const showAdvanced = ref<boolean>(settings.value.showAdvanced)
const textEffect = ref<string>(settings.value.textEffect)
const selectedModel = ref<string>(settings.value.selectedModel)
const copied = ref<boolean>(false)

// Available voices (flattened from all sections)
const availableVoices = computed<Voice[]>(() => {
  return voiceStore.voiceSections.flatMap(section => section.voices)
})

// Get resub tier max bits
const getResubTierMaxBits = (tier: 1 | 2 | 3): number => {
  switch (tier) {
    case 1:
      return 500
    case 2:
      return 1000
    case 3:
      return 2500
    default:
      return 500
  }
}

// Filter voices based on redeem method and tier
const eligibleVoices = computed<Voice[]>(() => {
  let filtered = availableVoices.value

  switch (redeemMethod.value) {
    case 'cheer':
      // Cheer: filter by bit amount if specified
      if (bitAmount.value && bitAmount.value > 0) {
        filtered = filtered.filter(voice => voice.cost <= bitAmount.value)
      }
      break
    case 'points':
      // Channel points: only non-premium voices (< 1000 bits)
      filtered = filtered.filter(voice => voice.cost < 1000)
      break
    case 'resub':
      // Resub: only voices within tier limits
      const maxBits = getResubTierMaxBits(resubTier.value)
      filtered = filtered.filter(voice => voice.cost <= maxBits)
      break
  }

  return filtered
})

// Voice options for dropdown
const voiceOptions = computed(() => {
  return eligibleVoices.value.map(voice => ({
    label: `${voice.name} (${voice.cost} bits)`,
    value: voice.name
  }))
})

// Text effect options
const textEffectOptions = [
  {label: 'None', value: 'none'},
  {label: 'Glitch', value: 'glitch'},
  {label: 'Typewriter', value: 'typewriter'},
  {label: 'Rainbow Wave', value: 'rainbow'},
  {label: 'Karaoke', value: 'karaoke'}
]

// Model options
const modelOptions = [
  {label: 'None', value: 'none'},
  {label: 'Turbo v2', value: 'turbo'},
  {label: 'Turbo v2.5', value: 'turbov2.5'},
  {label: 'Flash v2', value: 'flashv2'},
  {label: 'Flash v2.5', value: 'flashv2.5'},
  {label: 'Multilingual v2', value: 'multilingual'},
]

// Get voice cost by name
const getVoiceCost = (voiceName: string): number => {
  const voice = availableVoices.value.find(v => v.name === voiceName)
  return voice?.cost || 0
}

// Get minimum bit amount based on selected voice
const minBitAmount = computed<number>(() => {
  if (!selectedVoice.value) return 300
  const voiceCost = getVoiceCost(selectedVoice.value)
  return Math.max(300, voiceCost)
})

// Update bit amount when voice changes
const updateBitAmount = (): void => {
  const currentMin = minBitAmount.value
  if (bitAmount.value < currentMin) {
    bitAmount.value = currentMin
  }
}

// Clear selected voice if it becomes ineligible
const checkVoiceEligibility = (): void => {
  if (selectedVoice.value) {
    const isEligible = eligibleVoices.value.some(voice => voice.name === selectedVoice.value)
    if (!isEligible) {
      selectedVoice.value = ''
    }
  }
}

// Debounced bit amount watcher
let bitAmountTimeout: number | null = null
watch(bitAmount, () => {
  if (bitAmountTimeout) {
    clearTimeout(bitAmountTimeout)
  }
  bitAmountTimeout = setTimeout(() => {
    checkVoiceEligibility()
  }, 500) as unknown as number
})

// Generate voice tag with optional model and effect
const generateVoiceTag = (): string => {
  if (!selectedVoice.value) return ''

  const parts = [selectedVoice.value.toLowerCase()]

  // Add model if not none or default
  const hasCustomModel = selectedModel.value !== 'none'
  // Add effect if not none
  const hasEffect = textEffect.value !== 'none'

  if (hasCustomModel || hasEffect) {
    if (hasCustomModel) {
      parts.push(selectedModel.value)
    }
    if (hasEffect) {
      parts.push(textEffect.value)
    }
  }

  return `[${parts.join(':')}]`
}

// Generate command based on current form state
const generatedCommand = computed<string>(() => {
  if (!selectedVoice.value || !message.value.trim()) return ''

  const voiceTag = generateVoiceTag()
  let command = ''

  switch (redeemMethod.value) {
    case 'cheer':
      command = `Cheer${bitAmount.value || 300} ${voiceTag} ${message.value}`
      break
    case 'points':
    case 'resub':
      command = `${voiceTag} ${message.value}`
      break
  }

  return command
})

// Copy command to clipboard
const copyCommand = async (): Promise<void> => {
  if (!generatedCommand.value) return

  try {
    await navigator.clipboard.writeText(generatedCommand.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy command:', error)
  }
}

// Save settings to localStorage when they change
watch([selectedVoice, redeemMethod, bitAmount, resubTier, showAdvanced, textEffect, selectedModel], () => {
  settings.value = {
    selectedVoice: selectedVoice.value,
    redeemMethod: redeemMethod.value,
    bitAmount: bitAmount.value,
    resubTier: resubTier.value,
    showAdvanced: showAdvanced.value,
    textEffect: textEffect.value,
    selectedModel: selectedModel.value
  }
})

onMounted(() => {
  if (!voiceStore.voices.length) {
    voiceStore.loadVoices()
  }
})
</script>
