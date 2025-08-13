import { computed, ref, onMounted, onUnmounted, watch, type Ref } from "vue";
import { getIconComponent } from "@/utils/iconRegistry";

export interface VirtualIcon {
  id: string;
  component: any;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  color: string;
  logicalX: number;
  logicalY: number;
}

export interface VirtualGridConfig {
  icons: string[];
  iconSize: number;
  gap: number;
  baseOpacity: number;
  color: string;
  randomRotation: boolean;
  randomOpacity: boolean;
  randomColors: boolean;
  enableSlideAnimation: boolean;
  slideSpeed: number;
  slideDirection: "right" | "left" | "down" | "up" | "diagonal-down-right" | "diagonal-up-left";
}

export function useVirtualGrid(config: Ref<VirtualGridConfig>) {
  const viewportWidth = ref(1920);
  const viewportHeight = ref(1080);
  const scrollOffsetX = ref(0);
  const scrollOffsetY = ref(0);

  const patternSize = computed(() => config.value.iconSize + config.value.gap);
  const bufferSize = computed(() => Math.max(config.value.iconSize * 2, 100));

  const gridBounds = computed(() => {
    const buffer = bufferSize.value;
    const pattern = patternSize.value;

    const startX = Math.floor((scrollOffsetX.value - buffer) / pattern);
    const endX = Math.ceil((scrollOffsetX.value + viewportWidth.value + buffer) / pattern);
    const startY = Math.floor((scrollOffsetY.value - buffer) / pattern);
    const endY = Math.ceil((scrollOffsetY.value + viewportHeight.value + buffer) / pattern);

    return { startX, endX, startY, endY };
  });

  const themeColors = [
    "var(--theme-primary-500)",
    "var(--theme-primary-400)",
    "var(--theme-secondary-500)",
    "var(--theme-secondary-400)",
    "var(--theme-accent-500)",
    "var(--theme-accent-400)",
    "var(--theme-gray-400)",
    "var(--theme-gray-300)",
  ];

  const getIconAt = (logicalX: number, logicalY: number): VirtualIcon => {
    const iconIndex = Math.abs(logicalX * 37 + logicalY * 23) % config.value.icons.length;
    const iconName = config.value.icons[iconIndex];
    const component = getIconComponent(iconName);

    const rotationSeed = Math.abs(logicalX * 73 + logicalY * 31) % 360;
    const opacitySeed = Math.abs(logicalX * 47 + logicalY * 59) % 100;
    const colorSeed = Math.abs(logicalX * 61 + logicalY * 67) % themeColors.length;

    const baseRotation = config.value.randomRotation ? (rotationSeed - 180) / 2 : 0; // -90 to +90
    const opacity = config.value.randomOpacity
      ? config.value.baseOpacity * (0.5 + (opacitySeed / 100) * 0.5)
      : config.value.baseOpacity;
    const color = config.value.randomColors ? themeColors[colorSeed] : config.value.color;

    const x = logicalX * patternSize.value;
    const y = logicalY * patternSize.value;

    return {
      id: `icon-${logicalX}-${logicalY}`,
      component,
      x,
      y,
      rotation: baseRotation,
      opacity,
      color,
      logicalX,
      logicalY,
    };
  };

  const visibleIcons = computed(() => {
    const bounds = gridBounds.value;
    const icons: VirtualIcon[] = [];

    for (let logicalY = bounds.startY; logicalY <= bounds.endY; logicalY++) {
      for (let logicalX = bounds.startX; logicalX <= bounds.endX; logicalX++) {
        const icon = getIconAt(logicalX, logicalY);
        if (icon.component) {
          icons.push(icon);
        }
      }
    }

    return icons;
  });

  let animationId: number | null = null;
  const animationStartTime = ref(0);

  const startAnimation = () => {
    if (animationId) return;

    animationStartTime.value = performance.now();

    const animate = (timestamp: number) => {
      if (config.value.enableSlideAnimation) {
        const elapsed = (timestamp - animationStartTime.value) / 1000; // seconds
        const speed = config.value.slideSpeed * 30; // pixels per second

        let deltaX = 0;
        let deltaY = 0;

        switch (config.value.slideDirection) {
          case "right":
            deltaX = -elapsed * speed;
            break;
          case "left":
            deltaX = elapsed * speed;
            break;
          case "down":
            deltaY = -elapsed * speed;
            break;
          case "up":
            deltaY = elapsed * speed;
            break;
          case "diagonal-down-right":
            deltaX = -elapsed * speed * 0.707;
            deltaY = -elapsed * speed * 0.707;
            break;
          case "diagonal-up-left":
            deltaX = elapsed * speed * 0.707;
            deltaY = elapsed * speed * 0.707;
            break;
        }

        scrollOffsetX.value = deltaX;
        scrollOffsetY.value = deltaY;
      }

      if (config.value.enableSlideAnimation) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    scrollOffsetX.value = 0;
    scrollOffsetY.value = 0;
    animationStartTime.value = 0;
  };

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
    startAnimation();
  });

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", updateViewport);
    }
    stopAnimation();
  });

  watch(
    () => config.value.enableSlideAnimation,
    (enabled) => {
      if (enabled) {
        startAnimation();
      } else {
        stopAnimation();
      }
    },
  );

  watch(
    () => [config.value.slideDirection, config.value.slideSpeed],
    () => {
      if (config.value.enableSlideAnimation) {
        stopAnimation();
        startAnimation();
      }
    },
  );


  return {
    visibleIcons,
    scrollOffsetX,
    scrollOffsetY,
    patternSize,
  };
}
