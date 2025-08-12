<template>
  <div v-if="tier" class="absolute top-4 right-4 z-10">
    <!-- Badge -->
    <div :class="badgeClasses" class="px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 backdrop-blur-sm">
      <div class="flex items-center space-x-1">
        <StarIcon class="w-3 h-3" />
        <span>{{ tier }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TierLevel } from '@/types/voice'
import { StarIcon } from '@heroicons/vue/24/solid'

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