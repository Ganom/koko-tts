<!-- components/IconPatternBackground.vue -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { getIconComponent, defaultTechIcons } from "@/utils/iconRegistry";

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

const viewportWidth = ref(1920);
const viewportHeight = ref(1080);

// Calculate how many icons we need to fill the viewport
const patternSize = computed(() => props.iconSize + props.gap);
const iconsPerRow = computed(() => Math.ceil(viewportWidth.value / patternSize.value) + 2);
const iconsPerCol = computed(() => Math.ceil(viewportHeight.value / patternSize.value) + 2);

// Generate a single pattern of icons
const generatePattern = (offsetX = 0, offsetY = 0, idPrefix = '') => {
  const pattern = [];

  for (let row = 0; row < iconsPerCol.value; row++) {
    for (let col = 0; col < iconsPerRow.value; col++) {
      const iconIndex = (row * iconsPerRow.value + col) % props.icons.length;
      const iconName = props.icons[iconIndex];
      const component = getIconComponent(iconName);

      if (!component) continue; // Skip if icon not found

      // Generate deterministic random values
      const rotationSeed = (row * 37 + col * 23) % 360;
      const opacitySeed = (row * 17 + col * 41) % 100;
      const timingSeed = (row * 29 + col * 43) % 100;

      const rotation = props.randomRotation ? (rotationSeed - 180) / 2 : 0; // -90 to +90
      const opacity = props.randomOpacity
        ? props.opacity * (0.5 + (opacitySeed / 100) * 0.5)
        : props.opacity;

      // Animation properties
      const baseDuration = 20; // 20 seconds for 1x speed
      const animationDuration = baseDuration / props.animationSpeed;
      const animationDelay = (timingSeed / 100) * 2; // 0-2 second delay variation

      pattern.push({
        id: `${idPrefix}${row}-${col}`,
        component,
        x: col * patternSize.value - patternSize.value + offsetX,
        y: row * patternSize.value - patternSize.value + offsetY,
        rotation,
        opacity,
        animationDuration,
        animationDelay,
      });
    }
  }

  return pattern;
};

// Generate dual grids for seamless infinite scroll (works for horizontal/vertical)
const iconGrid = computed(() => {
  if (!props.enableSlideAnimation) {
    // Single grid when no slide animation
    return generatePattern();
  }

  // For slide animation, generate two identical grids positioned appropriately
  const grid1 = generatePattern(0, 0, 'grid1-');
  
  let grid2OffsetX = 0;
  let grid2OffsetY = 0;
  
  // Position second grid based on slide direction
  const totalWidth = iconsPerRow.value * patternSize.value;
  const totalHeight = iconsPerCol.value * patternSize.value;
  
  switch (props.slideDirection) {
    case 'right':
      grid2OffsetX = -totalWidth;
      break;
    case 'left':
      grid2OffsetX = totalWidth;
      break;
    case 'down':
      grid2OffsetY = -totalHeight;
      break;
    case 'up':
      grid2OffsetY = totalHeight;
      break;
    // Note: Diagonal directions will have corner gaps - will fix later
    case 'diagonal-down-right':
      grid2OffsetX = -totalWidth;
      grid2OffsetY = -totalHeight;
      break;
    case 'diagonal-up-left':
      grid2OffsetX = totalWidth;
      grid2OffsetY = totalHeight;
      break;
  }
  
  const grid2 = generatePattern(grid2OffsetX, grid2OffsetY, 'grid2-');
  
  return [...grid1, ...grid2];
});

// JavaScript-based smooth infinite scroll
const translateX = ref(0);
const translateY = ref(0);
let animationId: number | null = null;

const startSlideAnimation = () => {
  if (!props.enableSlideAnimation) return;
  
  const speed = props.slideAnimationSpeed * 0.5; // Adjust base speed
  const patternSizePx = patternSize.value;
  
  const animate = (timestamp: number) => {
    if (!props.enableSlideAnimation) return;
    
    // Calculate movement based on direction
    let deltaX = 0;
    let deltaY = 0;
    
    switch (props.slideDirection) {
      case 'right':
        deltaX = speed;
        break;
      case 'left':
        deltaX = -speed;
        break;
      case 'down':
        deltaY = speed;
        break;
      case 'up':
        deltaY = -speed;
        break;
      case 'diagonal-down-right':
        deltaX = speed * 0.707; // sqrt(2)/2 for diagonal
        deltaY = speed * 0.707;
        break;
      case 'diagonal-up-left':
        deltaX = -speed * 0.707;
        deltaY = -speed * 0.707;
        break;
    }
    
    // Update position
    translateX.value += deltaX;
    translateY.value += deltaY;
    
    // Reset position when we've moved the full grid distance (seamless loop with dual grids)
    const totalWidth = iconsPerRow.value * patternSizePx;
    const totalHeight = iconsPerCol.value * patternSizePx;
    
    if (Math.abs(translateX.value) >= totalWidth) {
      translateX.value = translateX.value % totalWidth;
    }
    if (Math.abs(translateY.value) >= totalHeight) {
      translateY.value = translateY.value % totalHeight;
    }
    
    animationId = requestAnimationFrame(animate);
  };
  
  animationId = requestAnimationFrame(animate);
};

const stopSlideAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  translateX.value = 0;
  translateY.value = 0;
};

// Update viewport size
const updateViewport = () => {
  if (typeof window !== "undefined") {
    viewportWidth.value = window.innerWidth;
    viewportHeight.value = window.innerHeight;
  }
};

onMounted(() => {
  updateViewport();
  if (typeof window !== "undefined") {
    window.addEventListener("resize", updateViewport);
  }
  startSlideAnimation();
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateViewport);
  }
  stopSlideAnimation();
});

// Watch for animation prop changes
watch(() => props.enableSlideAnimation, (enabled) => {
  if (enabled) {
    startSlideAnimation();
  } else {
    stopSlideAnimation();
  }
});

watch(() => [props.slideDirection, props.slideAnimationSpeed], () => {
  if (props.enableSlideAnimation) {
    stopSlideAnimation();
    startSlideAnimation();
  }
});
</script>

<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div 
      class="relative w-full h-full"
      :style="{
        transform: props.enableSlideAnimation ? `translate(${translateX}px, ${translateY}px)` : 'none',
        willChange: props.enableSlideAnimation ? 'transform' : 'auto',
      }"
    >
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
          transform: props.enableAnimation ? 'none' : `rotate(${icon.rotation}deg)`,
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: props.enableAnimation
            ? `icon-rotate ${icon.animationDuration}s linear infinite ${icon.animationDelay}s`
            : 'none',
          willChange: props.enableAnimation ? 'transform' : 'auto',
        }"
      >
        <component :is="icon.component" />
      </div>
    </div>
  </div>
</template>

<style>
@keyframes icon-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Slide animations now handled by JavaScript - no CSS animations needed */

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .icon-pattern * {
    animation: none !important;
  }
}
</style>
