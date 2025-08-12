<template>
  <CollapsibleSection :title="section.title" :default-open="true">
    <VoiceCard 
      v-for="voice in section.voices" 
      :key="voice.name" 
      :voice="voice" 
    />
  </CollapsibleSection>
</template>

<script setup lang="ts">
import type { VoiceSection } from '@/types/voice'
import CollapsibleSection from './CollapsibleSection.vue'
import VoiceCard from './VoiceCard.vue'

interface Props {
  section: VoiceSection
}

defineProps<Props>()
</script>