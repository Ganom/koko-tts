<template>
  <div class="max-w-6xl mx-auto mb-16">
    <div
      class="anime-card bg-gradient-dark rounded-4xl p-8 border border-primary-700/30"
      v-motion
      :initial="{ opacity: 0, y: 50 }"
:enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 400, ease: 'easeOut' } }"
    >
      <div 
        class="text-center mb-8"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
:enter="{ opacity: 1, y: 0, transition: { delay: 450, duration: 300 } }"
      >
        <h2 class="text-gradient-violet-pink text-3xl font-bold mb-3">TTS Message Builder</h2>
        <p class="text-gray-300 text-lg">Build and preview your TTS Message</p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8 mb-8">
        <div 
          class="space-y-6"
          v-motion
          :initial="{ opacity: 0, x: -30 }"
:enter="{ opacity: 1, x: 0, transition: { delay: 500, duration: 300, ease: 'easeOut' } }"
        >
          <div>
            <label class="block text-white font-bold mb-3">Redeem Method</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                @click="() => { redeemMethod = 'cheer'; checkVoiceEligibility() }"
                :class="redeemMethod === 'cheer' ? 'bg-primary-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-primary-700/40 text-white font-medium transition-colors"
              >
                Cheer
              </button>
              <button
                @click="() => { redeemMethod = 'points'; checkVoiceEligibility() }"
                :class="redeemMethod === 'points' ? 'bg-secondary-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-secondary-700/40 text-white font-medium transition-colors"
              >
                Channel Points
              </button>
              <button
                @click="() => { redeemMethod = 'resub'; checkVoiceEligibility() }"
                :class="redeemMethod === 'resub' ? 'bg-accent-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-accent-700/40 text-white font-medium transition-colors"
              >
                Resub
              </button>
            </div>
          </div>

          <div v-if="redeemMethod === 'cheer'">
            <label class="block text-white font-bold mb-3">Bit Amount</label>
            <input
              v-model.number="bitAmount"
              type="number"
              :min="minBitAmount"
              :placeholder="minBitAmount.toString()"
              :class="[
                'w-full bg-dark-900/60 border border-primary-700/40 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:border-primary-500/60 transition-colors',
                { 'flash-border': bitAmountUpdated }
              ]"
            >
            <p v-if="selectedVoice && minBitAmount > voiceStore.minCost" class="text-sm text-primary-300 mt-2">
              Minimum {{ minBitAmount }} bits for {{ selectedVoice }}
            </p>
            <p v-else-if="redeemMethod === 'cheer' && bitAmount" class="text-sm text-gray-400 mt-2">
              Voices up to {{ bitAmount }} bits available
            </p>
          </div>

          <div v-if="redeemMethod === 'resub'">
            <label class="block text-white font-bold mb-3">Subscription Tier</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                @click="() => { resubTier = 1; checkVoiceEligibility() }"
                :class="resubTier === 1 ? 'bg-primary-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-primary-700/40 text-white font-medium transition-colors"
              >
                Tier 1<br><span class="text-sm text-primary-300">500 bits</span>
              </button>
              <button
                @click="() => { resubTier = 2; checkVoiceEligibility() }"
                :class="resubTier === 2 ? 'bg-secondary-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-secondary-700/40 text-white font-medium transition-colors"
              >
                Tier 2<br><span class="text-sm text-secondary-300">1000 bits</span>
              </button>
              <button
                @click="() => { resubTier = 3; checkVoiceEligibility() }"
                :class="resubTier === 3 ? 'bg-accent-600' : 'bg-dark-700 hover:bg-dark-600'"
                class="p-3 rounded-lg border border-accent-700/40 text-white font-medium transition-colors"
              >
                Tier 3<br><span class="text-sm text-accent-300">2500 bits</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-white font-bold mb-3">Your Message</label>
            <textarea
              v-model="message"
              placeholder="Enter your message here..."
              class="w-full bg-dark-900/60 border border-primary-700/40 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:outline-none resize-none"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label class="block text-white font-bold mb-3">Text Effect</label>
            <CustomSelect
              v-model="textEffect"
              :options="textEffectOptions"
            />
          </div>

          <div>
            <label class="block text-white font-bold mb-3">Voice Model</label>
            <CustomSelect
              v-model="selectedModel"
              :options="modelOptions"
            />
          </div>
        </div>

        <div 
          class="space-y-6"
          v-motion
          :initial="{ opacity: 0, x: 30 }"
:enter="{ opacity: 1, x: 0, transition: { delay: 550, duration: 300, ease: 'easeOut' } }"
        >
          <div>
            <div class="flex items-center justify-between">
              <label class="block text-white font-bold mb-3">Select a Voice</label>
              <div v-if="selectedVoice" class="flex items-center gap-3">
                <span class="text-gray-300 text-sm">Preview:</span>
                <AudioPlayerSquare :voice-name="selectedVoice"/>
              </div>
            </div>
            <VoiceGrid
              v-model:selectedVoice="selectedVoice"
              :voices="availableVoices"
              :current-bit-amount="bitAmount"
              @change="(isSearching) => updateBitAmount(isSearching)"
            />
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div
        class="w-full h-px bg-gradient-to-r from-transparent via-primary-700/50 to-transparent mb-8"></div>

      <!-- Command Preview Section -->
      <div 
        class="glass rounded-2xl p-6 border border-primary-700/30"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
:enter="{ opacity: 1, y: 0, transition: { delay: 600, duration: 300, ease: 'easeOut' } }"
      >
        <h4 class="text-white font-bold mb-4 flex items-center">
          <Bars3Icon class="w-5 h-5 mr-2 text-primary-400"/>
          TTS Preview
        </h4>
        <div
          class="bg-dark-900/50 border border-primary-700/20 rounded-lg p-4 font-mono text-sm">
          <div v-if="generatedCommand" class="flex items-center justify-between gap-4">
            <div class="break-all flex-1">
              <span v-if="redeemMethod === 'cheer'" class="text-primary-300">Cheer{{ bitAmount }}&nbsp;</span><span
              v-if="selectedVoice" class="text-secondary-400">{{
                generateVoiceTag()
              }}&nbsp;</span><span class="text-accent-400">{{ displayMessage }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-px bg-gray-500"></div>
              <button
                @click="copyCommand"
                class="flex items-center gap-1 px-2 py-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded transition-colors whitespace-nowrap"
              >
                <CheckIcon v-if="copied" class="w-3 h-3"/>
                <ClipboardIcon v-else class="w-3 h-3"/>
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
            </div>
          </div>
          <div v-else class="text-gray-500 italic">
            Configure your voice message to see the TTS preview
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
import VoiceGrid from './VoiceGrid.vue'
import AudioPlayerSquare from './AudioPlayerSquare.vue'
import {useLocalStorage} from '@/composables/useLocalStorage'
import {Bars3Icon, CheckIcon, ClipboardIcon} from '@heroicons/vue/24/solid'

const voiceStore = useVoiceStore()

// Settings interface
interface VoiceBuilderSettings {
  selectedVoice: string
  redeemMethod: 'cheer' | 'points' | 'resub'
  bitAmount: number
  resubTier: 1 | 2 | 3
  textEffect: string
  selectedModel: string
  message: string
}

// Default settings
const defaultSettings: VoiceBuilderSettings = {
  selectedVoice: '',
  redeemMethod: 'cheer',
  bitAmount: 5000,
  resubTier: 1,
  textEffect: 'none',
  selectedModel: 'none',
  message: ''
}

// Load/save settings from localStorage
const [settings] = useLocalStorage('voiceBuilderSettings', defaultSettings)

// Form state - initialize from saved settings
const selectedVoice = ref<string>(settings.value.selectedVoice)
const message = ref<string>(settings.value.message)
const redeemMethod = ref<'cheer' | 'points' | 'resub'>(settings.value.redeemMethod)
const bitAmount = ref<number>(settings.value.bitAmount)
const resubTier = ref<1 | 2 | 3>(settings.value.resubTier)
const textEffect = ref<string>(settings.value.textEffect)
const selectedModel = ref<string>(settings.value.selectedModel)
const copied = ref<boolean>(false)
const bitAmountUpdated = ref<boolean>(false)

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

  // Sort by cost (descending), then by name
  return filtered.sort((a, b) => {
    if (a.cost !== b.cost) {
      return b.cost - a.cost;
    }
    return a.name.localeCompare(b.name);
  });
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

// Get voice preview text
const getVoicePreviewText = (voiceName: string): string => {
  const voice = availableVoices.value.find(v => v.name === voiceName)
  return voice?.text || ''
}

// Display message - shows preview text if message is empty and voice is selected
const displayMessage = computed<string>(() => {
  if (message.value?.trim()) {
    return message.value
  }
  if (selectedVoice.value) {
    return getVoicePreviewText(selectedVoice.value)
  }
  return ''
})

// Get minimum bit amount based on selected voice
const minBitAmount = computed<number>(() => {
  if (!selectedVoice.value) return voiceStore.minCost
  const voiceCost = getVoiceCost(selectedVoice.value)
  return Math.max(voiceStore.minCost, voiceCost || voiceStore.minCost)
})

// Update bit amount when voice changes
const updateBitAmount = (isSearching: boolean = false): void => {
  if (!selectedVoice.value) return
  
  const voiceCost = getVoiceCost(selectedVoice.value)
  const targetAmount = Math.max(voiceStore.minCost, voiceCost)
  
  // Only auto-update bit amount when actively searching
  if (isSearching && bitAmount.value !== targetAmount) {
    bitAmount.value = targetAmount
    // Trigger visual feedback
    bitAmountUpdated.value = true
    setTimeout(() => bitAmountUpdated.value = false, 1500)
  }
  // When not searching, only bump up if current amount is too low
  else if (!isSearching && bitAmount.value < targetAmount) {
    bitAmount.value = targetAmount
    // Trigger visual feedback
    bitAmountUpdated.value = true
    setTimeout(() => bitAmountUpdated.value = false, 1500)
  }
}

// Clear selected voice if it becomes ineligible
const checkVoiceEligibility = (): void => {
  if (selectedVoice.value) {
    const isEligible = eligibleVoices.value.some(voice => voice.name === selectedVoice.value)
    if (!isEligible) {
      const deselectedVoiceName = selectedVoice.value
      selectedVoice.value = ''
      console.log(`Voice '${deselectedVoiceName}' is no longer available for the current selection and was automatically removed.`)
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
    // Check if selected voice is still affordable
    if (selectedVoice.value) {
      const voiceCost = getVoiceCost(selectedVoice.value)
      if (bitAmount.value < voiceCost) {
        // Clear the selected voice if user can't afford it
        selectedVoice.value = ''
      }
    }
    
    // Enforce minimum bit amount
    const currentMin = minBitAmount.value
    if (bitAmount.value < currentMin) {
      bitAmount.value = currentMin
      // Trigger visual feedback
      bitAmountUpdated.value = true
      setTimeout(() => bitAmountUpdated.value = false, 1500)
    }
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
  if (!selectedVoice.value || !displayMessage.value?.trim()) return ''

  const voiceTag = generateVoiceTag()
  let command = ''

  switch (redeemMethod.value) {
    case 'cheer':
      command = `Cheer${bitAmount.value || 300} ${voiceTag} ${displayMessage.value}`
      break
    case 'points':
    case 'resub':
      command = `${voiceTag} ${displayMessage.value}`
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
watch([selectedVoice, redeemMethod, bitAmount, resubTier, textEffect, selectedModel, message], () => {
  settings.value = {
    selectedVoice: selectedVoice.value,
    redeemMethod: redeemMethod.value,
    bitAmount: bitAmount.value,
    resubTier: resubTier.value,
    textEffect: textEffect.value,
    selectedModel: selectedModel.value,
    message: message.value
  }
})

onMounted(() => {
  if (!voiceStore.voices.length) {
    voiceStore.loadVoices()
  }
})
</script>

<style scoped>
@keyframes flash {
  0%, 100% {
    border-color: var(--theme-primary-600);
  }
  50% {
    border-color: var(--theme-primary-400);
  }
}

.flash-border {
  animation: flash 0.5s ease-in-out 2;
}
</style>
