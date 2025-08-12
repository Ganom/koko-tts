<template>
  <div
    class="anime-card bg-gradient-dark rounded-2xl pt-12 px-6 pb-6 w-full hover:shadow-pink transition-all duration-300 border border-violet-700/30 hover:border-pink-500/60 group">
    <!-- Voice Icon -->
    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2">
      <img
        :src="iconPath"
        :alt="`${voice.name} icon`"
        class="w-16 h-16 object-contain pointer-events-none rounded-full bg-dark-900/60 backdrop-blur-sm border border-violet-500/40 p-2"
        loading="lazy"
      >
    </div>

    <TierBadge :tier="tierLevel"/>

    <!-- Cost Badge -->
    <div
      class="bg-gradient-to-r from-violet-500/20 to-pink-500/20 backdrop-blur-sm border border-violet-500/40 text-violet-300 px-4 py-2 rounded-xl text-sm font-bold text-center mb-4">
      <div class="flex items-center justify-center space-x-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
          <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clip-rule="evenodd"/>
        </svg>
        <span>{{ voice.cost }} Bits</span>
      </div>
    </div>

    <!-- Voice Name -->
    <h2
      class="text-2xl font-bold text-white text-center mb-6 group-hover:text-gradient transition-colors duration-300 break-words hyphens-auto line-clamp-2 min-h-[4rem]">
      {{ voice.name }}
    </h2>

    <!-- Audio Player -->
    <div class="flex justify-center mb-6">
      <AudioPlayer :voice-name="voice.name"/>
    </div>

    <!-- Voice Preview Text -->
    <div class="glass rounded-xl p-4 border border-violet-700/20">
      <p class="text-gray-300 text-center text-sm leading-relaxed">
        <span class="text-violet-300 font-mono bg-violet-900/30 px-2 py-1 rounded">[{{
            voice.name.toLowerCase()
          }}]</span>
        <span class="ml-2">{{ voice.text }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import type {Voice} from '@/types/voice'
import {TierLevel} from '@/types/voice'
import AudioPlayer from './AudioPlayer.vue'
import TierBadge from './TierBadge.vue'

interface Props {
  voice: Voice
}

const props = defineProps<Props>()

const tierLevel = computed<TierLevel | null>(() => {
  if (props.voice.cost <= 500) return TierLevel.T1
  if (props.voice.cost <= 1000) return TierLevel.T2
  if (props.voice.cost <= 2500) return TierLevel.T3
  return null
})

const iconPath = computed(() => `/icons/${props.voice.name.toLowerCase()}.webp`)
</script>
