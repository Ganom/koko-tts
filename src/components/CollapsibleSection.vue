<template>
  <div class="mb-12">
    <button
      @click="isOpen = !isOpen"
      class="w-full bg-gradient-dark hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-pink-600/20 text-white font-bold py-6 px-8 rounded-2xl flex items-center justify-between transition-all duration-300 border border-violet-700/30 hover:border-pink-500/60 hover:shadow-pink"
    >
      <div class="flex items-center">
        <div class="w-3 h-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full mr-4"></div>
        <span class="text-2xl font-bold text-gradient">{{ title }}</span>
      </div>
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-400 font-normal">
          {{ isOpen ? 'Hide' : 'Show' }} voices
        </span>
        <ChevronDownIcon
          class="w-6 h-6 transform transition-transform duration-300 flex-shrink-0"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </button>
    <transition
      enter-active-class="transition-all duration-500 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="transform opacity-0 max-h-0"
      enter-to-class="transform opacity-100 max-h-screen"
      leave-from-class="transform opacity-100 max-h-screen"
      leave-to-class="transform opacity-0 max-h-0"
    >
      <div v-show="isOpen" class="overflow-hidden">
        <div class="glass rounded-b-2xl border-x border-b border-violet-700/20 shadow-inner-glow">
          <div class="grid gap-12 p-8 pt-16 justify-center" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); max-width: 1200px; margin: 0 auto;">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

interface Props {
  title: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: true
})

const isOpen = ref(props.defaultOpen)
</script>
