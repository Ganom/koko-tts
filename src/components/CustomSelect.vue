<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="w-full bg-dark-900/60 border border-violet-700/40 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-violet-500/60 transition-colors cursor-pointer text-left flex items-center justify-between"
    >
      <span :class="{ 'text-gray-400': !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <ChevronDownIcon
        class="w-5 h-5 text-gray-400 transition-transform duration-200"
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
        class="bg-dark-800 border border-violet-700/40 rounded-lg shadow-xl max-h-64 overflow-y-auto"
        data-dropdown-content
        @mouseenter="isDropdownHovered = true"
        @mouseleave="isDropdownHovered = false"
        @wheel="handleDropdownWheel"
      >
        <div
          v-for="(option, index) in options"
          :key="option.value"
          @click="selectOption(option)"
          @mouseenter="highlightedIndex = index"
          class="px-4 py-3 text-white hover:bg-violet-600/20 cursor-pointer transition-colors border-b border-violet-700/20 last:border-b-0"
          :class="{ 
            'bg-violet-600/30': option.value === modelValue,
            'bg-violet-500/15': index === highlightedIndex && option.value !== modelValue
          }"
        >
          {{ option.label }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue: string | number
  options: SelectOption[]
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void

  (e: 'change'): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option...'
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()
const dropdownPosition = ref<{top: number, left: number, width: number} | null>(null)
const highlightedIndex = ref(-1)
const isDropdownHovered = ref(false)

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

const selectedLabel = computed(() => {
  const selected = props.options.find(option => option.value === props.modelValue)
  return selected?.label || ''
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    updateDropdownPosition()
    // Start at currently selected item or first item
    const currentIndex = props.options.findIndex(option => option.value === props.modelValue)
    highlightedIndex.value = currentIndex >= 0 ? currentIndex : 0
  } else {
    dropdownPosition.value = null
    highlightedIndex.value = -1
  }
}

const selectOption = (option: SelectOption): void => {
  emit('update:modelValue', option.value)
  emit('change')
  isOpen.value = false
  dropdownPosition.value = null
  highlightedIndex.value = -1
}

const navigateToOption = (option: SelectOption): void => {
  emit('update:modelValue', option.value)
  emit('change')
  // Don't close dropdown for keyboard navigation
}

const scrollToOption = (index: number) => {
  const dropdown = document.querySelector('[data-dropdown-content]') as HTMLElement
  if (!dropdown) return
  
  const option = dropdown.children[index] as HTMLElement
  if (!option) return
  
  const dropdownRect = dropdown.getBoundingClientRect()
  const optionRect = option.getBoundingClientRect()
  
  if (optionRect.bottom > dropdownRect.bottom) {
    dropdown.scrollTop += optionRect.bottom - dropdownRect.bottom
  } else if (optionRect.top < dropdownRect.top) {
    dropdown.scrollTop -= dropdownRect.top - optionRect.top
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      const nextIndex = Math.min(highlightedIndex.value + 1, props.options.length - 1)
      if (nextIndex !== highlightedIndex.value) {
        highlightedIndex.value = nextIndex
        scrollToOption(nextIndex)
        navigateToOption(props.options[nextIndex])
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      const prevIndex = Math.max(highlightedIndex.value - 1, 0)
      if (prevIndex !== highlightedIndex.value) {
        highlightedIndex.value = prevIndex
        scrollToOption(prevIndex)
        navigateToOption(props.options[prevIndex])
      }
      break
    case 'Escape':
      event.preventDefault()
      isOpen.value = false
      dropdownPosition.value = null
      highlightedIndex.value = -1
      break
  }
}

const closeDropdown = (event: MouseEvent): void => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
    dropdownPosition.value = null
    highlightedIndex.value = -1
  }
}

const handleScroll = (event: Event): void => {
  if (isOpen.value && !isDropdownHovered.value) {
    // Only close if dropdown isn't hovered and it's a wheel event
    if (event instanceof WheelEvent) {
      isOpen.value = false
      dropdownPosition.value = null
      highlightedIndex.value = -1
    }
  }
}

const handleDropdownWheel = (event: WheelEvent): void => {
  const dropdown = event.currentTarget as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = dropdown
  
  // Check if we're at the top or bottom of the dropdown
  const atTop = scrollTop === 0
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1
  
  // Prevent page scroll if we're trying to scroll beyond dropdown bounds
  if ((atTop && event.deltaY < 0) || (atBottom && event.deltaY > 0)) {
    event.preventDefault()
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('wheel', handleScroll, true)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('wheel', handleScroll, true)
})
</script>
