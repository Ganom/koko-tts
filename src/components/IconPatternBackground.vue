<script setup lang="ts">
import { computed } from "vue";
import { tropicalIcons } from "@/utils/iconRegistry";
import { useVirtualGrid } from "@/composables/useVirtualGrid";

import type { IconComponent } from "@/utils/iconRegistry";

interface Props {
  icons?: IconComponent[];
  iconSize?: number;
  gap?: number;
  opacity?: number;
  color?: string;
  randomRotation?: boolean;
  randomOpacity?: boolean;
  randomColors?: boolean;
  enableSlideAnimation?: boolean;
  slideAnimationSpeed?: number;
  slideDirection?: "right" | "left" | "down" | "up" | "diagonal-down-right" | "diagonal-up-left";
}

const props = withDefaults(defineProps<Props>(), {
  icons: () => tropicalIcons,
  iconSize: 48,
  gap: 32,
  opacity: 0.15,
  color: "#ffffff",
  randomRotation: true,
  randomOpacity: true,
  randomColors: false,
  enableSlideAnimation: false,
  slideAnimationSpeed: 3.0,
  slideDirection: "right",
});

const gridConfig = computed(() => ({
  icons: props.icons,
  iconSize: props.iconSize,
  gap: props.gap,
  baseOpacity: props.opacity,
  color: props.color,
  randomRotation: props.randomRotation,
  randomOpacity: props.randomOpacity,
  randomColors: props.randomColors,
  enableSlideAnimation: props.enableSlideAnimation,
  slideSpeed: props.slideAnimationSpeed,
  slideDirection: props.slideDirection,
}));

const { visibleIcons, scrollOffsetX, scrollOffsetY } = useVirtualGrid(gridConfig);
</script>

<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div
      class="relative w-full h-full"
      :style="{
        transform: props.enableSlideAnimation
          ? `translate(${-scrollOffsetX}px, ${-scrollOffsetY}px)`
          : 'none',
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
          color: icon.color,
          opacity: icon.opacity,
          transform: `rotate(${icon.rotation}deg)`,
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: props.enableSlideAnimation ? 'transform' : 'auto',
        }"
      >
        <component
          :is="icon.component"
          :size="props.iconSize"
          :width="props.iconSize"
          :height="props.iconSize"
        />
      </div>
    </div>
  </div>
</template>

<style>
@media (prefers-reduced-motion: reduce) {
  .icon-pattern * {
    animation: none !important;
  }
}
</style>
