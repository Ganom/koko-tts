<template>
  <button
    @click="togglePlay"
    :disabled="status === PlaybackStatus.ERROR"
    class="relative px-3 py-2 bg-gradient-dark hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-secondary-600/20 rounded-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed border border-primary-600/40 hover:border-primary-500/60 group min-w-[2.5rem]"
    :class="{ 'animate-pulse': isCurrentlyPlaying }"
    :title="status === PlaybackStatus.ERROR ? 'Audio file not available' : ''"
  >
    <!-- Loading spinner -->
    <svg v-if="status === PlaybackStatus.LOADING" class="w-4 h-4 text-white animate-spin"
         fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
              stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <!-- Play button -->
    <PlayIcon v-else-if="!isCurrentlyPlaying"
         class="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />

    <!-- Pause button -->
    <PauseIcon v-else
         class="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />

    <!-- Error icon -->
    <ExclamationTriangleIcon v-if="status === PlaybackStatus.ERROR" 
         class="w-4 h-4 text-white" />
  </button>
</template>

<script setup lang="ts">
import {computed, inject} from 'vue'
import {PlaybackStatus} from '@/types/audio'
import type {UseAudioReturn} from '@/composables/useAudio'
import { PlayIcon, PauseIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'

interface Props {
  voiceName: string
}

const props = defineProps<Props>()

const audio = inject<UseAudioReturn>('audio')
if (!audio) {
  throw new Error('Audio composable not provided')
}

const status = computed(() =>
  audio.playbackStatus.value.get(props.voiceName) || PlaybackStatus.IDLE
)

const isCurrentlyPlaying = computed(() =>
  audio.isPlaying(props.voiceName)
)

const togglePlay = async () => {
  if (status.value === PlaybackStatus.ERROR) return

  try {
    if (isCurrentlyPlaying.value) {
      audio.pause(props.voiceName)
    } else {
      await audio.play(props.voiceName)
    }
  } catch (error) {
    console.error(`Error playing ${props.voiceName}:`, error)
  }
}
</script>