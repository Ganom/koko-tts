import type { Component } from "vue";

export type StageGuideThemeName = "primary" | "secondary" | "accent";

export interface StageGuideEmote {
  src: string;
  alt: string;
}

export interface StageGuideCommand {
  id: string;
  label: string;
  text: string;
  threshold?: string;
  copyText?: string;
}

export interface StageGuideSection {
  id: string;
  title: string;
  threshold: string;
  theme: StageGuideThemeName;
  icon: Component;
  emotes: StageGuideEmote[];
  commands: StageGuideCommand[];
  details: string[];
  note: {
    title: string;
    text: string;
  };
}

export interface StageGuideThemeClasses {
  badge: string;
  border: string;
  command: string;
  copyButton: string;
  divider: string;
  header: string;
  icon: string;
  note: string;
  text: string;
}
