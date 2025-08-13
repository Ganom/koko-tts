<!-- components/IconPatternBackground.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { defaultTechIcons } from "@/utils/iconRegistry";
import { useVirtualGrid } from "@/composables/useVirtualGrid";

interface Props {
  icons?: string[];
  iconSize?: number;
  gap?: number;
  opacity?: number;
  color?: string;
  randomRotation?: boolean;
  randomOpacity?: boolean;
  enableAnimation?: boolean;
  animationSpeed?: number;
  enableSlideAnimation?: boolean;
  slideAnimationSpeed?: number;
  slideDirection?: 'right' | 'left' | 'down' | 'up' | 'diagonal-down-right' | 'diagonal-up-left';
}

const props = withDefaults(defineProps<Props>(), {
  icons: () => defaultTechIcons,
  iconSize: 48,
  gap: 32,
  opacity: 0.15,
  color: "#ffffff",
  randomRotation: true,
  randomOpacity: true,
  enableAnimation: false,
  animationSpeed: 1.0,
  enableSlideAnimation: false,
  slideAnimationSpeed: 3.0,
  slideDirection: 'right',
});

// Convert props to config object for virtual grid
const gridConfig = computed(() => ({
  icons: props.icons,
  iconSize: props.iconSize,
  gap: props.gap,
  baseOpacity: props.opacity,
  color: props.color,
  randomRotation: props.randomRotation,
  randomOpacity: props.randomOpacity,
  enableRotationAnimation: props.enableAnimation,
  rotationSpeed: props.animationSpeed,
  enableSlideAnimation: props.enableSlideAnimation,
  slideSpeed: props.slideAnimationSpeed,
  slideDirection: props.slideDirection,
}));

// Use the new virtual grid system
const { visibleIcons, scrollOffsetX, scrollOffsetY, getCurrentRotation } = useVirtualGrid(gridConfig);
</script>

<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div 
      class="relative w-full h-full"
      :style="{
        transform: props.enableSlideAnimation ? `translate(${-scrollOffsetX}px, ${-scrollOffsetY}px)` : 'none',
        willChange: props.enableSlideAnimation ? 'transform' : 'auto',
      }"
    >
      <div
        v-for="icon in visibleIcons"
        :key="icon.id"
        class="absolute"
        :style="{
          left: icon.x + 'px',
          top: icon.y + 'px',
          width: props.iconSize + 'px',
          height: props.iconSize + 'px',
          color: props.color,
          opacity: icon.opacity,
          transform: `rotate(${getCurrentRotation(icon)}deg)`,
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: props.enableAnimation || props.enableSlideAnimation ? 'transform' : 'auto',
        }"
      >
        <component :is="icon.component" />
      </div>
    </div>
  </div>
</template>

<style>
/* All animations now handled by JavaScript for consistency */

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .icon-pattern * {
    animation: none !important;
  }
}
</style>
