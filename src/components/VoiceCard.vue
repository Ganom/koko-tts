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
        <CurrencyDollarIcon class="w-4 h-4" />
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
import { CurrencyDollarIcon } from '@heroicons/vue/24/solid'

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
