import { ref } from "vue";

export type Theme = "violet-pink" | "pink-gold";

const THEME_KEY = "koko-tts-theme";

export const themes: Record<
  Theme,
  {
    name: string;
    colors: { primary: string; secondary: string; accent: string };
  }
> = {
  "pink-gold": {
    name: "Pink Gold",
    colors: { primary: "#f06292", secondary: "#bfa094", accent: "#f59e0b" },
  },
  "violet-pink": {
    name: "Violet Pink",
    colors: { primary: "#8b5cf6", secondary: "#ec4899", accent: "#f59e0b" },
  },
};

const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "pink-gold";

  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    return stored && stored in themes ? (stored as Theme) : "pink-gold";
  } catch {
    return "pink-gold";
  }
};

const currentTheme = ref<Theme>(getStoredTheme());

export function useTheme() {
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(THEME_KEY, theme);
      } catch {
        // ignore
      }
    }
  };

  const initTheme = () => {
    setTheme(getStoredTheme());
  };

  return {
    currentTheme,
    themes,
    setTheme,
    initTheme,
  };
}
