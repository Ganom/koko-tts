<template>
  <div class="theme-selector" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-4 py-2 bg-dark-800 border border-primary-600/40 rounded-lg hover:border-primary-500 transition-colors"
    >
      <div class="flex space-x-1">
        <div class="w-3 h-3 rounded-full"
             :style="{ backgroundColor: themes[currentTheme].colors.primary }"></div>
        <div class="w-3 h-3 rounded-full"
             :style="{ backgroundColor: themes[currentTheme].colors.secondary }"></div>
        <div class="w-3 h-3 rounded-full"
             :style="{ backgroundColor: themes[currentTheme].colors.accent }"></div>
      </div>
      <span class="text-white text-sm font-medium">{{ themes[currentTheme].name }}</span>
      <ChevronDownIcon
        class="w-4 h-4 text-gray-400 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen && dropdownPosition"
        :style="{
          position: 'fixed',
          top: dropdownPosition.top + 'px',
          left: dropdownPosition.left + 'px',
          width: dropdownPosition.width + 'px',
          zIndex: 999999
        }"
        class="bg-dark-800 border border-primary-600/40 rounded-lg shadow-xl overflow-hidden"
      >
        <button
          v-for="(theme, key) in themes"
          :key="key"
          @click="selectTheme(key)"
          class="w-full flex items-center space-x-3 px-4 py-3 hover:bg-primary-600/10 transition-colors border-b border-primary-600/20 last:border-b-0"
          :class="{ 'bg-primary-600/20': currentTheme === key }"
        >
          <div class="flex space-x-1">
            <div class="w-3 h-3 rounded-full"
                 :style="{ backgroundColor: theme.colors.primary }"></div>
            <div class="w-3 h-3 rounded-full"
                 :style="{ backgroundColor: theme.colors.secondary }"></div>
            <div class="w-3 h-3 rounded-full"
                 :style="{ backgroundColor: theme.colors.accent }"></div>
          </div>
          <span class="text-white text-sm font-medium">{{ theme.name }}</span>
          <CheckIcon v-if="currentTheme === key" class="w-4 h-4 text-primary-400 ml-auto" />
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {type Theme, useTheme} from '@/composables/useTheme'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/solid'

const {currentTheme, themes, setTheme} = useTheme()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()
const dropdownPosition = ref<{ top: number, left: number, width: number } | null>(null)

const updateDropdownPosition = () => {
  if (dropdownRef.value && isOpen.value) {
    const rect = dropdownRef.value.getBoundingClientRect()
    dropdownPosition.value = {
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width
    }
  }
}

const selectTheme = (theme: Theme) => {
  setTheme(theme)
  isOpen.value = false
  dropdownPosition.value = null
}

const closeDropdown = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
    dropdownPosition.value = null
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    updateDropdownPosition()
  } else {
    dropdownPosition.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
