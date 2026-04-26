import type { StageGuideSection } from "./types";

export const stageGuideHeroMotions = {
  nav: {
    initial: { opacity: 0, y: -16 },
    enter: { opacity: 1, y: 0, transition: { delay: 100, duration: 300, ease: "easeOut" } },
  },
  title: {
    initial: { opacity: 0, y: -30 },
    enter: { opacity: 1, y: 0, transition: { duration: 400, ease: "easeOut" } },
  },
  subtitle: {
    initial: { opacity: 0, y: 16 },
    enter: { opacity: 1, y: 0, transition: { delay: 80, duration: 300, ease: "easeOut" } },
  },
  decorativeContainer: {
    initial: { opacity: 0, scale: 0.8 },
    enter: {
      opacity: 1,
      scale: 1,
      transition: { delay: 120, duration: 300, ease: "easeOut" },
    },
  },
  decorativeDot1: {
    initial: { scale: 0 },
    enter: { scale: 1, transition: { delay: 220, duration: 200, ease: "backOut" } },
  },
  decorativeDot2: {
    initial: { scale: 0 },
    enter: { scale: 1, transition: { delay: 270, duration: 200, ease: "backOut" } },
  },
  decorativeDot3: {
    initial: { scale: 0 },
    enter: { scale: 1, transition: { delay: 320, duration: 200, ease: "backOut" } },
  },
};

export const stageGuideBannerMotion = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0, transition: { delay: 360, duration: 300, ease: "easeOut" } },
};

export const getStageGuideCardMotion = (section: StageGuideSection, index: number) => ({
  key: `stage-card-${section.id}`,
  initial: { opacity: 0, y: 28, scale: 0.96 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 460 + index * 80, duration: 300, ease: "easeOut" },
  },
  hover: { y: -4, scale: 1.01, transition: { duration: 180 } },
});
