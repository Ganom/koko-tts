<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="w-full bg-dark-900/60 border border-violet-700/40 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 hover:border-violet-500/60 transition-colors cursor-pointer text-left flex items-center justify-between"
    >
      <span :class="{ 'text-gray-400': !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <svg
        class="w-5 h-5 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"/>
      </svg>
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
      >
        <div
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="px-4 py-3 text-white hover:bg-violet-600/20 cursor-pointer transition-colors border-b border-violet-700/20 last:border-b-0"
          :class="{ 'bg-violet-600/30': option.value === modelValue }"
        >
          {{ option.label }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from 'vue'

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
  } else {
    dropdownPosition.value = null
  }
}

const selectOption = (option: SelectOption): void => {
  emit('update:modelValue', option.value)
  emit('change')
  isOpen.value = false
  dropdownPosition.value = null
}

const closeDropdown = (event: MouseEvent): void => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
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
