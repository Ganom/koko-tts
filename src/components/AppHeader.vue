<template>
  <header class="app-header">
    <div class="header-actions">
      <button
        type="button"
        class="info-toggle"
        :class="isInfoHidden ? 'info-toggle--muted' : 'info-toggle--active'"
        :aria-label="isInfoHidden ? 'Show instructions' : 'Hide instructions'"
        @click="emit('toggle-info')"
      >
        <Info class="info-toggle__icon" aria-hidden="true" />
      </button>
      <ThemeSelector />
    </div>

    <div class="header-lockup">
      <div class="sticker-mark" aria-hidden="true">
        <Volume2 class="sticker-mark__speaker" />
        <span class="sticker-mark__dot sticker-mark__dot--one" />
        <span class="sticker-mark__dot sticker-mark__dot--two" />
      </div>

      <h1 class="header-title">Koko TTS Voices</h1>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Info, Volume2 } from "@lucide/vue";
import ThemeSelector from "./ThemeSelector.vue";

defineProps<{
  isInfoHidden: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle-info"): void;
}>();
</script>

<style scoped>
.app-header {
  --header-ink: var(--theme-gray-50);
  --header-panel: color-mix(in srgb, var(--theme-dark-800) 84%, transparent);
  --header-focus: var(--theme-accent-300);
  position: relative;
  margin-bottom: clamp(3.5rem, 8vw, 5.5rem);
  padding: 0.5rem 0 0;
  text-align: center;
}

.header-actions {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  display: none;
  align-items: center;
  gap: 0.75rem;
}

.info-toggle {
  display: inline-grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  background: var(--header-panel);
  color: var(--header-ink);
  cursor: pointer;
  transition:
    border-color 160ms ease-out,
    opacity 160ms ease-out,
    background-color 160ms ease-out;
}

.info-toggle--muted {
  border-color: color-mix(in srgb, var(--theme-primary-500) 24%, transparent);
  opacity: 0.58;
}

.info-toggle--active {
  border-color: color-mix(in srgb, var(--theme-primary-400) 56%, transparent);
}

.info-toggle:hover {
  border-color: var(--theme-primary-400);
  opacity: 1;
}

.info-toggle:focus-visible {
  outline: 3px solid var(--header-focus);
  outline-offset: 3px;
}

.info-toggle__icon {
  width: 1rem;
  height: 1rem;
}

.header-lockup {
  position: relative;
  display: grid;
  justify-items: center;
  min-height: 10.25rem;
  padding: 0.75rem 0 0;
}

.sticker-mark {
  position: relative;
  display: grid;
  width: 4.15rem;
  height: 3.15rem;
  place-items: center;
  margin-bottom: 0.75rem;
  border: 2px solid var(--theme-accent-300);
  border-radius: 1.1rem 1.1rem 1.1rem 0.35rem;
  background: var(--theme-primary-600);
  box-shadow:
    0.35rem 0.35rem 0 var(--theme-dark-950),
    0.47rem 0.47rem 0 var(--theme-accent-300);
  color: var(--theme-gray-50);
  transform: rotate(-4deg);
}

.sticker-mark::after {
  position: absolute;
  bottom: -0.58rem;
  left: 0.52rem;
  width: 0.95rem;
  height: 0.95rem;
  border-right: 2px solid var(--theme-accent-300);
  border-bottom: 2px solid var(--theme-accent-300);
  background: var(--theme-primary-600);
  content: "";
  transform: skewY(-31deg) rotate(25deg);
}

.sticker-mark__speaker {
  position: relative;
  z-index: 1;
  width: 1.55rem;
  height: 1.55rem;
  stroke-width: 2.8;
}

.sticker-mark__dot {
  position: absolute;
  z-index: 1;
  width: 0.28rem;
  height: 0.28rem;
  border-radius: 50%;
  background: var(--theme-accent-200);
}

.sticker-mark__dot--one {
  top: 0.58rem;
  right: 0.62rem;
}

.sticker-mark__dot--two {
  right: 0.48rem;
  bottom: 0.52rem;
}

.header-title {
  position: relative;
  z-index: 1;
  max-width: 100%;
  margin: 0;
  color: var(--header-ink);
  font-size: clamp(2.65rem, 11vw, 6.75rem);
  font-weight: 800;
  letter-spacing: -0.055em;
  line-height: 0.88;
  text-shadow:
    0.055em 0.055em 0 var(--theme-dark-950),
    0.075em 0.075em 0 var(--theme-primary-600);
  text-wrap: balance;
}

@media (min-width: 768px) {
  .app-header {
    padding-top: 0;
  }

  .header-actions {
    display: flex;
  }

  .header-lockup {
    min-height: 14.5rem;
    padding-top: 1.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .info-toggle {
    transition-duration: 0.01ms;
  }
}
</style>
