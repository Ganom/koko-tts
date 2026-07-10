<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useTheme } from "@/composables/useTheme";
import { monkeyIconNodes } from "@/utils/iconRegistry";
import { buildIconPatternSvg, toSvgDataUri } from "@/utils/iconPattern";

import type { Application, Texture, Ticker, TilingSprite } from "pixi.js";

const THEME_COLOR_VARIABLES = [
  "--theme-primary-500",
  "--theme-primary-400",
  "--theme-secondary-500",
  "--theme-secondary-400",
  "--theme-accent-500",
  "--theme-accent-400",
  "--theme-gray-400",
  "--theme-gray-300",
];
const DEFAULT_COLORS = [
  "#f06292",
  "#f78c8c",
  "#bfa094",
  "#d2bab0",
  "#f59e0b",
  "#fbbf24",
  "#8c8c8c",
  "#a6a6a6",
];
const DRIFT_X_PIXELS_PER_SECOND = 4.5;
const DRIFT_Y_PIXELS_PER_SECOND = 2.25;

const containerRef = ref<HTMLElement | null>(null);
const fallbackTileDataUri = ref("");
const fallbackVisible = ref(true);
const { currentTheme } = useTheme();

let application: Application | null = null;
let tilingSprite: TilingSprite | null = null;
let tickerCallback: ((ticker: Ticker) => void) | null = null;
let resizeHandler: (() => void) | null = null;
let motionQuery: MediaQueryList | null = null;
let motionChangeHandler: ((event: MediaQueryListEvent) => void) | null = null;
let pixiModule: typeof import("pixi.js") | null = null;
let activeTextureAlias: string | null = null;
let tileGeneration = 0;
let destroyed = false;

const readThemeColors = () => {
  if (typeof window === "undefined") return DEFAULT_COLORS;

  const styles = window.getComputedStyle(document.documentElement);
  return THEME_COLOR_VARIABLES.map(
    (variable, index) => styles.getPropertyValue(variable).trim() || DEFAULT_COLORS[index],
  );
};

const releaseTexture = (alias: string | null) => {
  if (!alias || !pixiModule) return;

  void pixiModule.Assets.unload(alias).catch(() => {
    // A failed cleanup must not affect the viewer-facing background.
  });
};

const resizeTilingSprite = () => {
  if (!application || !tilingSprite) return;

  tilingSprite.width = application.screen.width;
  tilingSprite.height = application.screen.height;
};

const applyMotionPreference = () => {
  if (!application || !tilingSprite) return;

  if (motionQuery?.matches) {
    application.stop();
    application.renderer.render(application.stage);
  } else {
    application.start();
  }
};

const startAnimation = () => {
  if (!application || !tilingSprite || tickerCallback) return;

  tickerCallback = (ticker) => {
    if (!tilingSprite) return;

    tilingSprite.tilePosition.x -= (ticker.deltaMS / 1000) * DRIFT_X_PIXELS_PER_SECOND;
    tilingSprite.tilePosition.y -= (ticker.deltaMS / 1000) * DRIFT_Y_PIXELS_PER_SECOND;
  };
  application.ticker.add(tickerCallback);
  applyMotionPreference();
};

const updatePixiTexture = async (svg: string, generation: number) => {
  if (!pixiModule || !application || !tilingSprite) return false;

  const alias = `koko-icon-pattern-${generation}`;

  try {
    const texture = await pixiModule.Assets.load<Texture>({
      alias,
      src: toSvgDataUri(svg),
      data: { resolution: Math.min(window.devicePixelRatio || 1, 2) },
    });

    if (destroyed || generation !== tileGeneration || !tilingSprite) {
      releaseTexture(alias);
      return false;
    }

    const previousTextureAlias = activeTextureAlias;
    tilingSprite.texture = texture;
    activeTextureAlias = alias;
    releaseTexture(previousTextureAlias);
    fallbackVisible.value = false;
    startAnimation();
    return true;
  } catch (error) {
    console.warn("Unable to update the icon background texture.", error);
    return false;
  }
};

const rebuildTile = () => {
  const svg = buildIconPatternSvg({ icons: monkeyIconNodes, colors: readThemeColors() });
  fallbackTileDataUri.value = toSvgDataUri(svg);
  const generation = ++tileGeneration;

  void updatePixiTexture(svg, generation);
};

const initializePixi = async () => {
  try {
    const pixi = await import("pixi.js");
    if (destroyed || !containerRef.value) return;

    pixiModule = pixi;
    const nextApplication = new pixi.Application();
    await nextApplication.init({
      autoStart: false,
      backgroundAlpha: 0,
      preference: "webgl",
      resizeTo: containerRef.value,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      autoDensity: true,
    });

    if (destroyed || !containerRef.value) {
      nextApplication.destroy({ removeView: true }, true);
      return;
    }

    application = nextApplication;
    application.canvas.classList.add("block", "size-full");
    containerRef.value.appendChild(application.canvas);

    tilingSprite = new pixi.TilingSprite({
      texture: pixi.Texture.EMPTY,
      width: application.screen.width,
      height: application.screen.height,
    });
    application.stage.addChild(tilingSprite);

    resizeHandler = resizeTilingSprite;
    application.renderer.on("resize", resizeHandler);

    const generation = tileGeneration;
    const svg = buildIconPatternSvg({ icons: monkeyIconNodes, colors: readThemeColors() });
    await updatePixiTexture(svg, generation);
  } catch (error) {
    console.warn("Unable to initialize the icon background.", error);
  }
};

watch(currentTheme, rebuildTile);

onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionChangeHandler = () => applyMotionPreference();
  motionQuery.addEventListener("change", motionChangeHandler);

  rebuildTile();
  void initializePixi();
});

onUnmounted(() => {
  destroyed = true;
  tileGeneration += 1;

  if (motionQuery && motionChangeHandler) {
    motionQuery.removeEventListener("change", motionChangeHandler);
  }
  motionQuery = null;
  motionChangeHandler = null;

  if (application && tickerCallback) {
    application.ticker.remove(tickerCallback);
  }
  tickerCallback = null;

  if (application && resizeHandler) {
    application.renderer.off("resize", resizeHandler);
  }
  resizeHandler = null;

  const textureAlias = activeTextureAlias;
  activeTextureAlias = null;

  if (application) {
    application.stop();
    application.destroy({ removeView: true }, true);
  }
  application = null;
  tilingSprite = null;
  releaseTexture(textureAlias);
});
</script>

<template>
  <div
    ref="containerRef"
    class="fixed inset-0 overflow-hidden pointer-events-none"
    :style="fallbackVisible ? { backgroundImage: `url('${fallbackTileDataUri}')` } : undefined"
    aria-hidden="true"
  ></div>
</template>
