import {ref, watch} from 'vue'

export type Theme =
  'violet-pink'
  | 'pink-gold'

const THEME_KEY = 'koko-tts-theme'

export const themes: Record<Theme, {
  name: string;
  colors: { primary: string; secondary: string; accent: string }
}> = {
  'pink-gold': {
    name: 'Pink Gold',
    colors: {primary: '#f06292', secondary: '#bfa094', accent: '#f59e0b'}
  },
  'violet-pink': {
    name: 'Violet Pink',
    colors: {primary: '#8b5cf6', secondary: '#ec4899', accent: '#f59e0b'}
  },
}

const getStoredTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_KEY)
  return (stored && stored in themes) ? stored as Theme : 'pink-gold'
}

const currentTheme = ref<Theme>(getStoredTheme())

export function useTheme() {
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }

  const initTheme = () => {
    const theme = getStoredTheme()
    document.documentElement.setAttribute('data-theme', theme)
    currentTheme.value = theme
  }

  // Watch for theme changes and update document attribute
  watch(currentTheme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem(THEME_KEY, newTheme)
  })

  return {
    currentTheme,
    themes,
    setTheme,
    initTheme
  }
}
