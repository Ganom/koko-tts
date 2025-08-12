<template>
  <div class="mb-12">
    <button 
      @click="isOpen = !isOpen"
      class="w-full bg-gradient-dark hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-pink-600/20 text-white font-bold py-6 px-8 rounded-2xl flex items-center justify-between transition-all duration-300 border border-violet-700/30 hover:border-pink-500/60 shadow-violet hover:shadow-pink"
    >
      <div class="flex items-center">
        <div class="w-3 h-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full mr-4"></div>
        <span class="text-2xl font-bold text-gradient">{{ title }}</span>
      </div>
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-400 font-normal">
          {{ isOpen ? 'Hide' : 'Show' }} voices
        </span>
        <svg 
          class="w-6 h-6 transform transition-transform duration-300 flex-shrink-0"
          :class="{ 'rotate-180': isOpen }"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
        </svg>
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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 p-8 pt-16">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: true
})

const isOpen = ref(props.defaultOpen)
</script>