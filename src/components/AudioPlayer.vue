<template>
  <button
    @click="togglePlay"
    :disabled="status === PlaybackStatus.ERROR"
    class="relative w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-600 rounded-full flex items-center justify-center hover:from-violet-400 hover:to-pink-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-violet-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed shadow-violet hover:shadow-pink group"
    :class="{ 'animate-pulse-slow': isCurrentlyPlaying, 'hover:scale-105': status !== PlaybackStatus.ERROR }"
    :title="status === PlaybackStatus.ERROR ? 'Audio file not available' : ''"
  >
    <!-- Ripple effect for playing state -->
    <div v-if="isCurrentlyPlaying"
         class="absolute inset-0 rounded-full bg-violet-500/30 animate-ping"></div>
    <!-- Loading spinner -->
    <svg v-if="status === PlaybackStatus.LOADING" class="w-6 h-6 text-white animate-spin"
         fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
              stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <!-- Play button -->
    <svg v-else-if="!isCurrentlyPlaying"
         class="relative z-10 w-7 h-7 text-white ml-1 group-hover:scale-110 transition-transform duration-200"
         fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 4v12l10-6z"/>
    </svg>

    <!-- Pause button -->
    <svg v-else
         class="relative z-10 w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200"
         fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/>
    </svg>

    <!-- Error icon -->
    <svg v-if="status === PlaybackStatus.ERROR" class="relative z-10 w-7 h-7 text-white"
         fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import {computed, inject} from 'vue'
import {PlaybackStatus} from '@/types/audio'
import type {UseAudioReturn} from '@/composables/useAudio'

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
