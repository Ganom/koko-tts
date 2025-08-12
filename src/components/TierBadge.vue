<template>
  <div v-if="tier" class="absolute top-4 right-4 z-10">
    <!-- Badge -->
    <div :class="badgeClasses" class="px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 backdrop-blur-sm">
      <div class="flex items-center space-x-1">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <span>{{ tier }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TierLevel } from '@/types/voice'

interface Props {
  tier: TierLevel | null
}

const props = defineProps<Props>()

const badgeClasses = computed(() => {
  switch (props.tier) {
    case TierLevel.T1:
      return 'bg-gradient-to-r from-violet-500 to-violet-600 text-white'
    case TierLevel.T2:
      return 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
    case TierLevel.T3:
      return 'bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900'
    default:
      return 'bg-gradient-to-r from-violet-500 to-pink-500 text-white'
  }
})
</script>