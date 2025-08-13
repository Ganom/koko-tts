<!-- components/IconPatternBackground.vue -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { getIconComponent, defaultTechIcons } from "@/utils/iconRegistry";

interface Props {
  icons?: string[];
  iconSize?: number;
  gap?: number;
  opacity?: number;
  color?: string;
  randomRotation?: boolean;
  randomOpacity?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icons: () => defaultTechIcons,
  iconSize: 48,
  gap: 32,
  opacity: 0.15,
  color: "#ffffff",
  randomRotation: true,
  randomOpacity: true,
});

const viewportWidth = ref(1920);
const viewportHeight = ref(1080);

// Calculate how many icons we need to fill the viewport
const patternSize = computed(() => props.iconSize + props.gap);
const iconsPerRow = computed(() => Math.ceil(viewportWidth.value / patternSize.value) + 2);
const iconsPerCol = computed(() => Math.ceil(viewportHeight.value / patternSize.value) + 2);

// Generate the icon grid
const iconGrid = computed(() => {
  const grid = [];
  
  for (let row = 0; row < iconsPerCol.value; row++) {
    for (let col = 0; col < iconsPerRow.value; col++) {
      const iconIndex = (row * iconsPerRow.value + col) % props.icons.length;
      const iconName = props.icons[iconIndex];
      const component = getIconComponent(iconName);
      
      if (!component) continue; // Skip if icon not found
      
      // Generate deterministic random values
      const rotationSeed = (row * 37 + col * 23) % 360;
      const opacitySeed = (row * 17 + col * 41) % 100;
      
      const rotation = props.randomRotation ? (rotationSeed - 180) / 2 : 0; // -90 to +90
      const opacity = props.randomOpacity 
        ? props.opacity * (0.5 + (opacitySeed / 100) * 0.5) 
        : props.opacity;
      
      grid.push({
        id: `${row}-${col}`,
        component,
        x: col * patternSize.value - patternSize.value,
        y: row * patternSize.value - patternSize.value,
        rotation,
        opacity,
      });
    }
  }
  
  return grid;
});

// Update viewport size
const updateViewport = () => {
  if (typeof window !== 'undefined') {
    viewportWidth.value = window.innerWidth;
    viewportHeight.value = window.innerHeight;
  }
};

onMounted(() => {
  updateViewport();
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateViewport);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateViewport);
  }
});
</script>

<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div class="relative w-full h-full">
      <div
        v-for="icon in iconGrid"
        :key="icon.id"
        class="absolute"
        :style="{
          left: icon.x + 'px',
          top: icon.y + 'px',
          width: props.iconSize + 'px',
          height: props.iconSize + 'px',
          color: props.color,
          opacity: icon.opacity,
          transform: `rotate(${icon.rotation}deg)`,
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }"
      >
        <component :is="icon.component" />
      </div>
    </div>
  </div>
</template>