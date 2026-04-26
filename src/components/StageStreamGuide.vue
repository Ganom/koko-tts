<template>
  <main class="max-w-7xl mx-auto pb-16">
    <nav
      class="mb-10 flex items-center gap-4"
      aria-label="Stage guide navigation"
      v-motion="motions.nav"
    >
      <a
        :href="homeHref"
        class="inline-flex items-center gap-2 rounded-lg border-2 border-primary-500/30 bg-dark-900/45 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur transition-colors hover:border-primary-400 hover:bg-primary-900/30"
      >
        <ArrowLeft class="h-4 w-4 text-primary-300" />
        <span>Koko TTS Voices</span>
      </a>
    </nav>

    <header class="mb-8 text-center">
      <h1
        class="text-gradient-violet-pink animate-float mb-5 text-4xl font-bold md:text-6xl"
        v-motion="motions.title"
      >
        Stage How-To
      </h1>
      <p class="mx-auto max-w-3xl text-lg text-gray-300 md:text-xl" v-motion="motions.subtitle">
        Grab the exact stream commands for joining stage, landing a heckle, or voting on the current
        performer.
      </p>
      <div
        class="mt-8 flex justify-center space-x-3"
        data-testid="stage-decorative-dots"
        aria-hidden="true"
        v-motion="motions.decorativeContainer"
      >
        <span class="h-3 w-3 rounded-full bg-primary-500" v-motion="motions.decorativeDot1" />
        <span class="h-3 w-3 rounded-full bg-secondary-500" v-motion="motions.decorativeDot2" />
        <span class="h-3 w-3 rounded-full bg-accent-500" v-motion="motions.decorativeDot3" />
      </div>
    </header>

    <section
      class="stage-help-panel mb-8 rounded-lg border-2 border-accent-500/45 p-5"
      aria-label="First time stage help"
      v-motion="motions.banner"
    >
      <div class="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-500 text-dark-950"
          aria-hidden="true"
        >
          <Info class="h-6 w-6" />
        </div>
        <div>
          <p class="font-bold text-white">New to Koko TTS voices?</p>
          <p class="mt-1 text-sm text-gray-300">
            Visit the main page first if you need voice names, defaults, or examples.
          </p>
        </div>
        <a
          :href="homeHref"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-accent-400/45 bg-accent-500/10 px-4 py-2 text-sm font-bold text-accent-100 transition-colors hover:border-accent-300 hover:bg-accent-500/20"
        >
          <span>Visit the main voices page</span>
          <ExternalLink class="h-4 w-4" />
        </a>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      <article
        v-for="(section, index) in sections"
        :key="section.title"
        :class="[
          'stage-guide-card flex h-full flex-col overflow-hidden rounded-lg border-2',
          themeClasses[section.theme].border,
        ]"
        :aria-labelledby="`${section.id}-title`"
        v-motion="getCardMotion(index)"
      >
        <div
          :class="[
            'border-b px-5 py-3',
            themeClasses[section.theme].divider,
            themeClasses[section.theme].header,
          ]"
        >
          <div class="flex min-h-14 items-start justify-between gap-4">
            <div class="flex items-start gap-4">
              <div
                :class="[
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white',
                  themeClasses[section.theme].icon,
                ]"
              >
                <component :is="section.icon" class="h-6 w-6" />
              </div>
              <div>
                <p
                  :class="[
                    'mb-2 inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold uppercase tracking-wider',
                    themeClasses[section.theme].badge,
                  ]"
                >
                  {{ section.threshold }}
                </p>
                <h2 :id="`${section.id}-title`" class="text-2xl font-bold text-white">
                  {{ section.title }}
                </h2>
              </div>
            </div>

            <div class="flex h-12 shrink-0 items-center gap-2">
              <img
                v-for="emote in section.emotes"
                :key="emote.alt"
                :src="emote.src"
                :alt="emote.alt"
                class="h-11 w-11 object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-1 flex-col p-5">
          <div class="space-y-3">
            <div v-for="command in section.commands" :key="command.id">
              <div class="mb-2 flex items-center justify-between gap-3">
                <p class="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {{ command.label }}
                </p>
                <p
                  v-if="command.threshold"
                  :class="[
                    'rounded-lg border px-2 py-0.5 text-xs font-bold',
                    themeClasses[section.theme].badge,
                  ]"
                >
                  {{ command.threshold }}
                </p>
              </div>
              <div
                :class="[
                  'grid grid-cols-[1fr_auto] items-stretch overflow-hidden rounded-lg border-2 bg-dark-950/75 shadow-lg',
                  themeClasses[section.theme].command,
                ]"
              >
                <code
                  class="flex min-h-14 min-w-0 items-center whitespace-nowrap px-3 py-3 font-mono text-sm font-bold text-white md:text-sm"
                >
                  {{ command.text }}
                </code>
                <button
                  type="button"
                  :aria-label="`Copy ${command.label.toLowerCase()}`"
                  :class="[
                    'inline-flex w-[5.25rem] items-center justify-center gap-1.5 border-l px-2 text-sm font-bold transition-colors',
                    themeClasses[section.theme].copyButton,
                  ]"
                  @click="copyCommand(command)"
                >
                  <Check v-if="copiedCommandId === command.id" class="h-4 w-4" />
                  <Copy v-else class="h-4 w-4" />
                  <span>{{ copiedCommandId === command.id ? "Copied" : "Copy" }}</span>
                </button>
              </div>
            </div>
          </div>

          <ul class="mt-5 space-y-3">
            <li
              v-for="detail in section.details"
              :key="detail"
              class="grid grid-cols-[auto_1fr] gap-3 text-sm font-medium text-gray-200"
            >
              <CheckCircle2
                :class="['mt-0.5 h-5 w-5 shrink-0', themeClasses[section.theme].text]"
              />
              <span>{{ detail }}</span>
            </li>
          </ul>

          <div class="mt-auto pt-8">
            <div :class="['rounded-lg border px-4 py-3 text-sm', themeClasses[section.theme].note]">
              <p class="font-bold text-white">{{ section.note.title }}</p>
              <p class="mt-1 text-gray-300">{{ section.note.text }}</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  MessageSquareText,
  Mic2,
  ThumbsUp,
} from "lucide-vue-next";

type ThemeName = "primary" | "secondary" | "accent";

interface Emote {
  src: string;
  alt: string;
}

interface GuideCommand {
  id: string;
  label: string;
  text: string;
  threshold?: string;
  copyText?: string;
}

interface GuideSection {
  id: string;
  title: string;
  threshold: string;
  theme: ThemeName;
  icon: typeof Mic2;
  emotes: Emote[];
  commands: GuideCommand[];
  details: string[];
  note: {
    title: string;
    text: string;
  };
}

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
const homeHref = import.meta.env.BASE_URL;
const emotePath = (filename: string) => `${baseUrl}/stage-emotes/${filename}`;

const copiedCommandId = ref<string | null>(null);
let resetCopiedTimer: number | undefined;

const fallbackCopy = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const didCopy = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error("Copy command failed");
  }
};

const writeClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  fallbackCopy(text);
};

const copyCommand = async (command: GuideCommand) => {
  await writeClipboard(command.copyText ?? command.text);
  copiedCommandId.value = command.id;

  if (resetCopiedTimer) {
    window.clearTimeout(resetCopiedTimer);
  }

  resetCopiedTimer = window.setTimeout(() => {
    if (copiedCommandId.value === command.id) {
      copiedCommandId.value = null;
    }
  }, 1600);
};

const emotes = {
  scooting: {
    src: emotePath("scooting.webp"),
    alt: "Scooting emote",
  },
  aaaa: {
    src: emotePath("aaaa.webp"),
    alt: "AAAA emote",
  },
  yay: {
    src: emotePath("yay.webp"),
    alt: "Yay emote",
  },
  boo: {
    src: emotePath("boo.webp"),
    alt: "Boo emote",
  },
} satisfies Record<string, Emote>;

const sections: GuideSection[] = [
  {
    id: "join-stage",
    title: "Get On Stage",
    threshold: "300 bits",
    theme: "primary",
    icon: Mic2,
    emotes: [emotes.scooting],
    commands: [
      {
        id: "join",
        label: "Queue command",
        text: "Cheer300 !join",
      },
    ],
    details: [
      "Koko pulls performers from the queue one at a time and posts in chat before your turn.",
      "Your chat messages are voiced by the puppet until your 2.5 min set ends or Koko boots you.",
      "Use any voice that is not a priority voice. Without a voice, it uses your default.",
    ],
    note: {
      title: "Keep the set tight",
      text: "Avoid v3 unless the message is short or it genuinely improves the bit.",
    },
  },
  {
    id: "send-heckle",
    title: "Send a Heckle",
    threshold: "100+ or 1000 bits",
    theme: "secondary",
    icon: MessageSquareText,
    emotes: [emotes.aaaa],
    commands: [
      {
        id: "standard-heckle",
        label: "Standard heckle",
        text: "Cheer100 wrap it up",
        threshold: "100+ bits",
      },
      {
        id: "vip-heckle",
        label: "VIP dandy heckle",
        text: "Cheer1000 filthy fleepos",
        threshold: "1000 bits",
      },
    ],
    details: [
      "Cheer 100+ bits with your message, or use the TTS redeem.",
      "Cheer 1000 bits to speak as the VIP dandy.",
      "Keep heckles to 100 characters because longer heckles get trimmed.",
    ],
    note: {
      title: "Important",
      text: "Do not include !join in a heckle. Any message with !join is treated as a stage join.",
    },
  },
  {
    id: "vote-performer",
    title: "Vote",
    threshold: "Chat vote",
    theme: "accent",
    icon: ThumbsUp,
    emotes: [emotes.yay, emotes.boo],
    commands: [
      { id: "vote-yay", label: "Yay vote", text: "Yay" },
      { id: "vote-boo", label: "Boo vote", text: "Boo" },
    ],
    details: [
      "Type exactly Yay or Boo while a performer is on stage.",
      "Each person gets one active vote.",
      "Send the other word before the set ends to change your vote.",
    ],
    note: {
      title: "Exact words only",
      text: "Extra words or punctuation can miss the vote parser. Send Yay or Boo by itself.",
    },
  },
];

const themeClasses: Record<
  ThemeName,
  {
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
> = {
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

const motions = {
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
  banner: {
    initial: { opacity: 0, y: 16 },
    enter: { opacity: 1, y: 0, transition: { delay: 360, duration: 300, ease: "easeOut" } },
  },
};

const getCardMotion = (index: number) => ({
  key: `stage-card-${sections[index].id}`,
  initial: { opacity: 0, y: 28, scale: 0.96 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 460 + index * 80, duration: 300, ease: "easeOut" },
  },
  hover: { y: -4, scale: 1.01, transition: { duration: 180 } },
});
</script>

<style scoped>
.stage-help-panel,
.stage-guide-card {
  background: color-mix(in srgb, var(--theme-gray-900) 88%, var(--theme-dark-950));
  backdrop-filter: blur(10px);
  box-shadow:
    0 22px 30px color-mix(in srgb, var(--theme-dark-950) 55%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--theme-gray-100) 8%, transparent);
}
</style>
