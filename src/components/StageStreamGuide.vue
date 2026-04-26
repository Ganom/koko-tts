<template>
  <main class="max-w-7xl mx-auto pb-16">
    <nav class="mb-10 flex items-center justify-between gap-4">
      <a
        :href="homeHref"
        class="inline-flex items-center gap-2 rounded-lg border-2 border-primary-500/30 bg-dark-900/40 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur transition-colors hover:border-primary-400 hover:bg-primary-900/30"
      >
        <ArrowLeft class="h-4 w-4 text-primary-300" />
        <span>Koko TTS Voices</span>
      </a>

      <div
        class="hidden items-center gap-2 rounded-lg border border-accent-500/30 bg-dark-900/40 px-3 py-2 text-xs font-bold uppercase tracking-wider text-accent-200 backdrop-blur sm:flex"
      >
        <Radio class="h-4 w-4" />
        <span>Stage mode</span>
      </div>
    </nav>

    <header class="mb-12 text-center" v-motion="motions.hero">
      <div class="mb-6 flex justify-center gap-3" aria-hidden="true">
        <span
          v-for="emote in heroEmotes"
          :key="emote.alt"
          class="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-primary-500/25 bg-dark-900/50 shadow-lg backdrop-blur"
        >
          <img :src="emote.src" alt="" class="h-11 w-11 object-contain" />
        </span>
      </div>

      <p class="mb-3 text-sm font-bold uppercase tracking-wider text-accent-300">
        Stage stream participation guide
      </p>
      <h1 class="text-gradient-violet-pink mb-5 text-4xl font-bold md:text-6xl">Stage How-To</h1>
      <p class="mx-auto max-w-3xl text-lg text-gray-300 md:text-xl">
        Join the stage queue, land a heckle, and vote on the current performer with the exact stream
        commands Koko expects.
      </p>
    </header>

    <section class="mb-8 grid gap-4 md:grid-cols-3" aria-label="Stage mode thresholds">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="glass rounded-lg border-2 border-primary-500/25 p-5"
        v-motion="motions.stat"
      >
        <p class="text-sm font-bold uppercase tracking-wider text-gray-400">{{ stat.label }}</p>
        <p class="mt-2 text-3xl font-bold text-white">{{ stat.value }}</p>
        <p class="mt-1 text-sm text-gray-300">{{ stat.detail }}</p>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      <article
        v-for="section in sections"
        :key="section.title"
        :class="['glass rounded-lg border-2 p-6 shadow-xl', themeClasses[section.theme].border]"
        v-motion="motions.card"
      >
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <div
              :class="[
                'mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-white',
                themeClasses[section.theme].icon,
              ]"
            >
              <component :is="section.icon" class="h-6 w-6" />
            </div>
            <h2 class="text-2xl font-bold text-white">{{ section.title }}</h2>
          </div>

          <div class="flex shrink-0 gap-2">
            <img
              v-for="emote in section.emotes"
              :key="emote.alt"
              :src="emote.src"
              :alt="emote.alt"
              class="h-12 w-12 object-contain drop-shadow-lg"
            />
          </div>
        </div>

        <p class="text-gray-300">{{ section.summary }}</p>

        <div class="mt-5 space-y-3">
          <div v-for="command in section.commands" :key="command.text">
            <p class="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">
              {{ command.label }}
            </p>
            <code
              :class="[
                'block rounded-lg border bg-dark-950/55 px-4 py-3 font-mono text-sm font-bold text-white',
                themeClasses[section.theme].command,
              ]"
            >
              {{ command.text }}
            </code>
          </div>
        </div>

        <ul class="mt-5 space-y-3">
          <li
            v-for="detail in section.details"
            :key="detail"
            class="flex gap-3 text-sm text-gray-300"
          >
            <CheckCircle2 :class="['mt-0.5 h-4 w-4 shrink-0', themeClasses[section.theme].text]" />
            <span>{{ detail }}</span>
          </li>
        </ul>

        <div
          v-if="section.note"
          :class="['mt-6 rounded-lg border px-4 py-3 text-sm', themeClasses[section.theme].note]"
        >
          <p class="font-bold text-white">{{ section.note.title }}</p>
          <p class="mt-1 text-gray-300">{{ section.note.text }}</p>
        </div>
      </article>
    </section>

    <section
      class="anime-card mt-8 rounded-lg border-2 border-primary-500/30 p-6"
      v-motion="motions.footer"
    >
      <div class="grid gap-6 md:grid-cols-[auto,1fr] md:items-center">
        <div
          class="flex h-14 w-14 items-center justify-center rounded-lg bg-accent-500 text-dark-950"
          aria-hidden="true"
        >
          <Sparkles class="h-7 w-7" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Keep the set tight</h2>
          <p class="mt-2 text-gray-300">
            Short messages land best on stream. Long heckles get trimmed, and slow voice models can
            make stage messages fall out of sync with the performance.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquareText,
  Mic2,
  Radio,
  Sparkles,
  ThumbsUp,
} from "lucide-vue-next";

type ThemeName = "primary" | "secondary" | "accent";

interface Emote {
  src: string;
  alt: string;
}

interface GuideSection {
  title: string;
  theme: ThemeName;
  icon: typeof Mic2;
  emotes: Emote[];
  summary: string;
  commands: Array<{
    label: string;
    text: string;
  }>;
  details: string[];
  note?: {
    title: string;
    text: string;
  };
}

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
const homeHref = import.meta.env.BASE_URL;
const emotePath = (filename: string) => `${baseUrl}/stage-emotes/${filename}`;

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

const heroEmotes = [emotes.scooting, emotes.aaaa, emotes.yay, emotes.boo];

const stats = [
  {
    label: "Join stage",
    value: "300+ bits",
    detail: "Cheer with !join in the same chat message.",
  },
  {
    label: "Heckle",
    value: "100+ bits",
    detail: "Cheer with a short message or use the TTS redeem.",
  },
  {
    label: "VIP Dandy",
    value: "500+ bits",
    detail: "Heckle as the VIP dandy voice.",
  },
];

const sections: GuideSection[] = [
  {
    title: "Get On Stage",
    theme: "primary",
    icon: Mic2,
    emotes: [emotes.scooting],
    summary: "Cheer 300+ bits with !join in the same message to enter the stage queue.",
    commands: [{ label: "Queue command", text: "Cheer300 !join" }],
    details: [
      "Koko pulls performers from the queue one at a time and posts in chat before your turn.",
      "Your chat messages are voiced by the puppet until your 3 min set ends or Koko boots you.",
      "You can use any voice that is not a priority voice. Without a voice, Koko uses your default.",
    ],
    note: {
      title: "Tip",
      text: "Avoid v3 unless the message is short or it genuinely improves the bit. V3 can take a long time and drift out of sync.",
    },
  },
  {
    title: "Send a Heckle",
    theme: "secondary",
    icon: MessageSquareText,
    emotes: [emotes.aaaa],
    summary: "Drop a short message into the show without joining the stage queue.",
    commands: [
      { label: "Standard heckle", text: "Cheer100 wrap it up" },
      { label: "VIP dandy heckle", text: "Cheer500 filthy fleepos" },
    ],
    details: [
      "Cheer 100+ bits with your message, or use the TTS redeem.",
      "Cheer 500+ bits to speak as the VIP dandy.",
      "Keep it short because long heckles get trimmed.",
    ],
    note: {
      title: "Important",
      text: "Do not include !join in a heckle. Any message with !join is treated as a stage join.",
    },
  },
  {
    title: "Vote on the Performer",
    theme: "accent",
    icon: ThumbsUp,
    emotes: [emotes.yay, emotes.boo],
    summary: "While someone is on stage, vote with one exact chat word.",
    commands: [{ label: "Vote command", text: "Yay or Boo" }],
    details: [
      "Type exactly Yay or Boo while a performer is on stage.",
      "Each person gets one active vote.",
      "Send the other word before the set ends to change your vote.",
    ],
  },
];

const themeClasses: Record<
  ThemeName,
  {
    border: string;
    command: string;
    icon: string;
    note: string;
    text: string;
  }
> = {
  primary: {
    border: "border-primary-500/30 hover:border-primary-400/60",
    command: "border-primary-500/25 text-primary-100",
    icon: "bg-primary-600",
    note: "border-primary-500/25 bg-primary-950/35",
    text: "text-primary-300",
  },
  secondary: {
    border: "border-secondary-500/30 hover:border-secondary-400/60",
    command: "border-secondary-500/25 text-secondary-100",
    icon: "bg-secondary-600",
    note: "border-secondary-500/25 bg-secondary-950/35",
    text: "text-secondary-300",
  },
  accent: {
    border: "border-accent-500/30 hover:border-accent-400/60",
    command: "border-accent-500/25 text-accent-100",
    icon: "bg-accent-500 text-dark-950",
    note: "border-accent-500/25 bg-accent-950/35",
    text: "text-accent-300",
  },
};

const motions = {
  hero: {
    initial: { opacity: 0, y: 24 },
    enter: { opacity: 1, y: 0, transition: { duration: 350, ease: "easeOut" } },
  },
  stat: {
    initial: { opacity: 0, y: 16 },
    enter: { opacity: 1, y: 0, transition: { delay: 120, duration: 250, ease: "easeOut" } },
  },
  card: {
    initial: { opacity: 0, y: 28 },
    enter: { opacity: 1, y: 0, transition: { delay: 180, duration: 300, ease: "easeOut" } },
    hover: { y: -4, transition: { duration: 180 } },
  },
  footer: {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { delay: 260, duration: 300, ease: "easeOut" } },
  },
};
</script>
