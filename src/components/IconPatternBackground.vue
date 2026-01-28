<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { tropicalIcons } from "@/utils/iconRegistry";

import type { LucideIcon } from "lucide-vue-next";
import type { IconComponent, IconNode } from "@/utils/iconRegistry";

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

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const prefersReducedMotion = ref(false);

const viewportWidth = ref(0);
const viewportHeight = ref(0);
const devicePixelRatio = ref(1);

const patternSize = computed(() => props.iconSize + props.gap);
const bufferSize = computed(() => Math.max(props.iconSize * 2, 100));

const isAnimationEnabled = computed(
  () => props.enableSlideAnimation && !prefersReducedMotion.value,
);

const themeColorVars = [
  "--theme-primary-500",
  "--theme-primary-400",
  "--theme-secondary-500",
  "--theme-secondary-400",
  "--theme-accent-500",
  "--theme-accent-400",
  "--theme-gray-400",
  "--theme-gray-300",
];

const iconNodeCache = new WeakMap<LucideIcon, IconNode>();
const iconPathsCache = new WeakMap<IconNode, Path2D[]>();

const toNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const getThemeColors = (): string[] => {
  if (typeof window === "undefined") return themeColorVars.map(() => props.color);

  const style = window.getComputedStyle(document.documentElement);
  return themeColorVars.map((variable) => style.getPropertyValue(variable).trim() || props.color);
};

const extractIconNode = (icon: IconComponent): IconNode | null => {
  if (Array.isArray(icon)) return icon;

  if (typeof icon !== "function") return null;

  const cached = iconNodeCache.get(icon);
  if (cached) return cached;

  const vnode = icon({ size: 24 }, { attrs: {}, slots: {} } as any);
  const node = (vnode as { props?: { iconNode?: unknown } } | null | undefined)?.props?.iconNode;

  if (Array.isArray(node)) {
    iconNodeCache.set(icon, node);
    return node;
  }

  return null;
};

const roundedRectPath = (x: number, y: number, width: number, height: number, radius: number) => {
  const path = new Path2D();
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));

  if (r === 0) {
    path.rect(x, y, width, height);
    return path;
  }

  path.moveTo(x + r, y);
  path.lineTo(x + width - r, y);
  path.arcTo(x + width, y, x + width, y + r, r);
  path.lineTo(x + width, y + height - r);
  path.arcTo(x + width, y + height, x + width - r, y + height, r);
  path.lineTo(x + r, y + height);
  path.arcTo(x, y + height, x, y + height - r, r);
  path.lineTo(x, y + r);
  path.arcTo(x, y, x + r, y, r);
  path.closePath();

  return path;
};

const parsePoints = (points: string): number[] => {
  const matches = points.match(/-?\\d*\\.?\\d+/g);
  if (!matches) return [];
  return matches.map((p) => Number.parseFloat(p)).filter((n) => Number.isFinite(n));
};

const buildPathsForIconNode = (iconNode: IconNode): Path2D[] => {
  const cached = iconPathsCache.get(iconNode);
  if (cached) return cached;

  const paths: Path2D[] = [];

  for (const [tag, attrs] of iconNode) {
    switch (tag) {
      case "path": {
        const d = attrs.d;
        if (typeof d === "string" && d.length > 0) {
          paths.push(new Path2D(d));
        }
        break;
      }
      case "circle": {
        const cx = toNumber(attrs.cx);
        const cy = toNumber(attrs.cy);
        const r = toNumber(attrs.r);
        if (r > 0) {
          const path = new Path2D();
          path.arc(cx, cy, r, 0, Math.PI * 2);
          paths.push(path);
        }
        break;
      }
      case "ellipse": {
        const cx = toNumber(attrs.cx);
        const cy = toNumber(attrs.cy);
        const rx = toNumber(attrs.rx);
        const ry = toNumber(attrs.ry);
        if (rx > 0 && ry > 0) {
          const path = new Path2D();
          path.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          paths.push(path);
        }
        break;
      }
      case "rect": {
        const x = toNumber(attrs.x);
        const y = toNumber(attrs.y);
        const width = toNumber(attrs.width);
        const height = toNumber(attrs.height);
        const rx = toNumber(attrs.rx);
        const ry = toNumber(attrs.ry, rx);
        if (width > 0 && height > 0) {
          paths.push(roundedRectPath(x, y, width, height, Math.min(rx, ry)));
        }
        break;
      }
      case "line": {
        const x1 = toNumber(attrs.x1);
        const y1 = toNumber(attrs.y1);
        const x2 = toNumber(attrs.x2);
        const y2 = toNumber(attrs.y2);
        const path = new Path2D();
        path.moveTo(x1, y1);
        path.lineTo(x2, y2);
        paths.push(path);
        break;
      }
      case "polyline":
      case "polygon": {
        const pts = typeof attrs.points === "string" ? parsePoints(attrs.points) : [];
        if (pts.length >= 4) {
          const path = new Path2D();
          path.moveTo(pts[0], pts[1]);
          for (let i = 2; i < pts.length; i += 2) {
            path.lineTo(pts[i], pts[i + 1]);
          }
          if (tag === "polygon") path.closePath();
          paths.push(path);
        }
        break;
      }
    }
  }

  iconPathsCache.set(iconNode, paths);
  return paths;
};

const getScrollOffsets = (elapsedSeconds: number) => {
  if (!isAnimationEnabled.value) return { x: 0, y: 0 };

  const speed = props.slideAnimationSpeed * 30;
  let deltaX = 0;
  let deltaY = 0;

  switch (props.slideDirection) {
    case "right":
      deltaX = -elapsedSeconds * speed;
      break;
    case "left":
      deltaX = elapsedSeconds * speed;
      break;
    case "down":
      deltaY = -elapsedSeconds * speed;
      break;
    case "up":
      deltaY = elapsedSeconds * speed;
      break;
    case "diagonal-down-right":
      deltaX = -elapsedSeconds * speed * 0.707;
      deltaY = -elapsedSeconds * speed * 0.707;
      break;
    case "diagonal-up-left":
      deltaX = elapsedSeconds * speed * 0.707;
      deltaY = elapsedSeconds * speed * 0.707;
      break;
  }

  return { x: deltaX, y: deltaY };
};

const draw = (elapsedSeconds: number) => {
  const canvas = canvasRef.value;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  const width = viewportWidth.value;
  const height = viewportHeight.value;
  if (width <= 0 || height <= 0) return;

  const dpr = devicePixelRatio.value;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const icons = props.icons;
  if (!icons.length) return;

  const themeColors = props.randomColors ? getThemeColors() : [];
  const { x: scrollOffsetX, y: scrollOffsetY } = getScrollOffsets(elapsedSeconds);

  const pattern = patternSize.value;
  const buffer = bufferSize.value;

  const startX = Math.floor((scrollOffsetX - buffer) / pattern);
  const endX = Math.ceil((scrollOffsetX + width + buffer) / pattern);
  const startY = Math.floor((scrollOffsetY - buffer) / pattern);
  const endY = Math.ceil((scrollOffsetY + height + buffer) / pattern);

  const scale = props.iconSize / 24;
  const lineWidth = scale > 0 ? 2 / scale : 2;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (let logicalY = startY; logicalY <= endY; logicalY++) {
    for (let logicalX = startX; logicalX <= endX; logicalX++) {
      const iconIndex = Math.abs(logicalX * 37 + logicalY * 23) % icons.length;
      const iconNode = extractIconNode(icons[iconIndex]);
      if (!iconNode) continue;

      const paths = buildPathsForIconNode(iconNode);
      if (!paths.length) continue;

      const rotationSeed = Math.abs(logicalX * 73 + logicalY * 31) % 360;
      const opacitySeed = Math.abs(logicalX * 47 + logicalY * 59) % 100;
      const colorSeed = Math.abs(logicalX * 61 + logicalY * 67) % themeColorVars.length;

      const rotationDeg = props.randomRotation ? (rotationSeed - 180) / 2 : 0;
      const opacity = props.randomOpacity
        ? props.opacity * (0.5 + (opacitySeed / 100) * 0.5)
        : props.opacity;

      const color = props.randomColors ? (themeColors[colorSeed] ?? props.color) : props.color;

      const x = logicalX * pattern - scrollOffsetX;
      const y = logicalY * pattern - scrollOffsetY;

      ctx.save();
      ctx.translate(x + props.iconSize / 2, y + props.iconSize / 2);
      if (rotationDeg !== 0) ctx.rotate((rotationDeg * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.translate(-12, -12);
      ctx.globalAlpha = opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      for (const path of paths) {
        ctx.stroke(path);
      }

      ctx.restore();
    }
  }
};

const getMaxDevicePixelRatio = (width: number, height: number) => {
  const rawDevicePixelRatio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const maxPixels = 16_000_000;

  const targetPixels = width * height * rawDevicePixelRatio * rawDevicePixelRatio;
  if (targetPixels <= maxPixels) return rawDevicePixelRatio;

  return Math.sqrt(maxPixels / (width * height));
};

const updateCanvasSize = () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas) return;

  const rect = container?.getBoundingClientRect();
  const measuredWidth = rect?.width ?? 0;
  const measuredHeight = rect?.height ?? 0;
  const width = Math.max(1, Math.floor(measuredWidth > 0 ? measuredWidth : window.innerWidth));
  const height = Math.max(1, Math.floor(measuredHeight > 0 ? measuredHeight : window.innerHeight));

  viewportWidth.value = width;
  viewportHeight.value = height;

  const dpr = getMaxDevicePixelRatio(width, height);
  devicePixelRatio.value = dpr;

  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  if (!isAnimationEnabled.value) {
    draw(0);
  }
};

let animationId: number | null = null;
let animationStartTime = 0;

const startAnimation = () => {
  if (typeof window === "undefined") return;
  if (animationId !== null) return;

  animationStartTime = performance.now();

  const loop = (timestamp: number) => {
    if (!isAnimationEnabled.value) {
      stopAnimation();
      draw(0);
      return;
    }

    const elapsed = (timestamp - animationStartTime) / 1000;
    draw(elapsed);
    animationId = requestAnimationFrame(loop);
  };

  animationId = requestAnimationFrame(loop);
};

const stopAnimation = () => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  animationStartTime = 0;
};

let resizeObserver: ResizeObserver | null = null;
let themeObserver: MutationObserver | null = null;
let motionQuery: MediaQueryList | null = null;
let motionChangeHandler: ((event: MediaQueryListEvent) => void) | null = null;
let pendingDrawId: number | null = null;

const requestDraw = () => {
  if (typeof window === "undefined") return;
  if (isAnimationEnabled.value) return;
  if (pendingDrawId !== null) return;

  pendingDrawId = requestAnimationFrame(() => {
    pendingDrawId = null;
    draw(0);
  });
};

watch(
  () => [
    props.icons,
    props.iconSize,
    props.gap,
    props.opacity,
    props.color,
    props.randomRotation,
    props.randomOpacity,
    props.randomColors,
  ],
  () => requestDraw(),
);

watch(
  () => isAnimationEnabled.value,
  (enabled) => {
    if (enabled) {
      startAnimation();
    } else {
      stopAnimation();
      requestDraw();
    }
  },
);

watch(
  () => [props.slideDirection, props.slideAnimationSpeed],
  () => {
    if (isAnimationEnabled.value) {
      stopAnimation();
      startAnimation();
    } else {
      requestDraw();
    }
  },
);

onMounted(() => {
  if (typeof window === "undefined") return;

  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = motionQuery.matches;

  motionChangeHandler = (event: MediaQueryListEvent) => {
    prefersReducedMotion.value = event.matches;
  };

  motionQuery.addEventListener("change", motionChangeHandler);

  updateCanvasSize();
  window.addEventListener("resize", updateCanvasSize, { passive: true });

  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(updateCanvasSize);
    if (containerRef.value) resizeObserver.observe(containerRef.value);
  }

  themeObserver = new MutationObserver(() => requestDraw());
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  if (isAnimationEnabled.value) {
    startAnimation();
  } else {
    draw(0);
  }
});

onUnmounted(() => {
  stopAnimation();

  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateCanvasSize);
  }

  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  if (themeObserver) {
    themeObserver.disconnect();
    themeObserver = null;
  }

  if (motionQuery) {
    if (motionChangeHandler) {
      motionQuery.removeEventListener("change", motionChangeHandler);
    }
    motionQuery = null;
  }
  motionChangeHandler = null;

  if (pendingDrawId !== null) {
    cancelAnimationFrame(pendingDrawId);
    pendingDrawId = null;
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="fixed inset-0 overflow-hidden pointer-events-none"
    aria-hidden="true"
  >
    <canvas ref="canvasRef" class="block w-full h-full" />
  </div>
</template>
