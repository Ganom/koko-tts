import type { StageGuideThemeClasses, StageGuideThemeName } from "./types";

export const stageGuideThemeClasses: Record<StageGuideThemeName, StageGuideThemeClasses> = {
  primary: {
    badge: "border-primary-400/40 bg-primary-500/15 text-primary-100",
    border: "border-primary-500/30 hover:border-primary-400/60",
    command: "border-primary-400/55 shadow-primary-950/50",
    copyButton: "border-primary-400/30 bg-primary-500/15 text-primary-100 hover:bg-primary-500/25",
    divider: "border-primary-500/20",
    header: "bg-primary-950/20",
    icon: "bg-primary-600",
    note: "border-primary-500/25 bg-primary-950/35",
    text: "text-primary-300",
  },
  secondary: {
    badge: "border-secondary-400/40 bg-secondary-500/15 text-secondary-100",
    border: "border-secondary-500/30 hover:border-secondary-400/60",
    command: "border-secondary-400/55 shadow-secondary-950/50",
    copyButton:
      "border-secondary-400/30 bg-secondary-500/15 text-secondary-100 hover:bg-secondary-500/25",
    divider: "border-secondary-500/20",
    header: "bg-secondary-950/20",
    icon: "bg-secondary-600",
    note: "border-secondary-500/25 bg-secondary-950/35",
    text: "text-secondary-300",
  },
  accent: {
    badge: "border-accent-400/45 bg-accent-500/15 text-accent-100",
    border: "border-accent-500/30 hover:border-accent-400/60",
    command: "border-accent-400/60 shadow-accent-950/50",
    copyButton: "border-accent-400/35 bg-accent-500/15 text-accent-100 hover:bg-accent-500/25",
    divider: "border-accent-500/20",
    header: "bg-accent-950/20",
    icon: "bg-accent-500 text-dark-950",
    note: "border-accent-500/25 bg-accent-950/35",
    text: "text-accent-300",
  },
};
