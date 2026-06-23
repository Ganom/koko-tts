<template>
  <div class="max-w-6xl mx-auto mb-16">
    <div
      class="anime-card relative rounded-4xl p-8 mb-8 border-2 border-primary-500/30"
      v-motion="containerMotion"
    >
      <button
        @click="emit('hide')"
        class="absolute top-4 right-4 p-2 bg-dark-800 border-2 border-primary-600/20 rounded-lg transition-colors hover:border-primary-500 text-gray-400 hover:text-white"
        aria-label="Hide instructions"
      >
        <X class="w-4 h-4" />
      </button>
      <div class="text-center mb-8" v-motion="headerMotion">
        <h2 class="text-gradient-violet-pink text-3xl font-bold mb-3">Make Your Message Heard</h2>
        <p class="text-gray-300 text-lg">
          Use Bits, Channel Points, or Subs to have your message read aloud on stream!
        </p>
      </div>

      <div class="mb-10">
        <h3 class="text-white text-2xl font-semibold mb-6 text-center md:text-left">
          Activation Methods
        </h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="method in activationMethods"
            :key="method.title"
            v-motion="getCardMotion()"
            :class="getCardClasses(method.colorTheme)"
          >
            <div class="flex items-center mb-4">
              <div
                :class="getIconWrapperClasses(method.colorTheme)"
                class="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
              >
                <component :is="method.icon" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-white font-bold text-xl">{{ method.title }}</h3>
            </div>
            <p class="text-gray-300 mb-3">{{ method.description }}</p>

            <div v-if="method.command" :class="getCommandClasses(method.colorTheme)">
              <span v-for="part in method.command" :key="part.text" :class="part.class">
                {{ part.text }}
              </span>
            </div>

            <div v-if="method.tiers" class="space-y-2 text-sm">
              <div
                v-for="tier in method.tiers"
                :key="tier.name"
                class="flex justify-between items-center"
              >
                <span :class="tier.class">{{ tier.name }}</span>
                <span :class="tier.badgeClass" class="px-2 py-1 rounded text-white">
                  {{ tier.value }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <h3 class="text-white text-2xl font-semibold mb-6 text-center md:text-left">
          Voice Customization
        </h3>
        <p class="text-gray-300 text-sm mb-4 text-center md:text-left">
          Look for the
          <span
            class="inline-flex items-center rounded-full bg-accent-900/40 border border-accent-500/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-200 align-middle"
          >
            Priority
          </span>
          badge. It marks <strong class="text-accent-200">redeem-priority</strong> voices that take
          a higher spot in the redeem queue when the streamer runs one.
        </p>
        <div
          class="glass rounded-2xl p-6 border-2 border-primary-500/30"
          v-motion="customizationContainerMotion"
        >
          <div class="grid md:grid-cols-2 md:divide-x md:divide-primary-700/30 gap-6 md:gap-0">
            <div
              v-for="(command, index) in customizationCommands"
              :key="command.title"
              :class="index === 0 ? 'md:pr-6' : 'md:pl-6'"
            >
              <div class="flex items-center mb-4">
                <div
                  :class="getIconWrapperClasses(command.colorTheme)"
                  class="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                >
                  <component :is="command.icon" class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 class="text-white font-bold text-xl">{{ command.title }}</h3>
                  <p class="text-gray-300">{{ command.description }}</p>
                </div>
              </div>
              <div :class="getCommandClasses(command.colorTheme)">
                <span v-for="part in command.command" :key="part.text" :class="part.class">
                  {{ part.text }}
                </span>
              </div>
              <p v-if="command.hint" class="text-xs text-gray-400 mt-2">{{ command.hint }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showChatCommands" class="mb-10">
        <h3 class="text-white text-2xl font-semibold mb-2 text-center md:text-left">
          Chat Commands &amp; Voting
        </h3>
        <p class="text-gray-300 text-sm mb-6 text-center md:text-left">
          Type these in chat any time. They pause while a stage performance is running.
        </p>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="group in chatCommandGroups"
            :key="group.title"
            v-motion="getCardMotion()"
            :class="getCardClasses(group.colorTheme)"
            class="flex h-full flex-col"
          >
            <div class="flex items-start mb-5">
              <div
                :class="getIconWrapperClasses(group.colorTheme)"
                class="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
              >
                <component :is="group.icon" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-white font-bold text-xl leading-tight">{{ group.title }}</h3>
                <p class="text-gray-400 text-sm mt-1">{{ group.description }}</p>
              </div>
            </div>
            <ul class="grid gap-2.5">
              <li
                v-for="item in group.items"
                :key="item.cmd"
                class="grid grid-cols-[max-content_1fr] items-center gap-3 text-sm"
              >
                <code
                  v-if="group.variant === 'commands'"
                  class="justify-self-start rounded-md border bg-dark-950/70 px-2.5 py-1 font-mono font-bold text-white"
                  :class="getCommandPillClasses(group.colorTheme)"
                  >{{ item.cmd }}</code
                >
                <span
                  v-else
                  class="inline-flex items-center gap-1 justify-self-start rounded-md border px-2.5 py-1 font-mono font-bold"
                  :class="getVoteChipClasses(item.tone)"
                >
                  <component :is="item.tone === 'up' ? ChevronUp : ChevronDown" class="h-4 w-4" />
                  {{ item.cmd }}
                </span>
                <span class="text-gray-300">{{ item.desc }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-white text-2xl font-semibold mb-6 text-center md:text-left">
          Good to Know
        </h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div
            v-for="note in goodToKnow"
            :key="note.title"
            v-motion="getCardMotion()"
            :class="getCardClasses(note.colorTheme)"
          >
            <div class="flex items-start">
              <div
                :class="getIconWrapperClasses(note.colorTheme)"
                class="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
              >
                <component :is="note.icon" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 class="text-white font-bold text-lg mb-1">{{ note.title }}</h4>
                <p class="text-gray-300 text-sm">{{ note.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from "vue";
import {
  ChevronDown,
  ChevronUp,
  Gift,
  Heart,
  Plus,
  RotateCcw,
  ShieldAlert,
  SkipForward,
  Sparkles,
  Trophy,
  X,
} from "@lucide/vue";
import { useConfigStore } from "@/stores/configStore";
import { useVoiceStore } from "@/stores/voiceStore";

const emit = defineEmits<{
  hide: [];
}>();

const configStore = useConfigStore();
const voiceStore = useVoiceStore();

// animations
const containerMotion = {
  initial: { opacity: 0, y: 50 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { delay: 200, duration: 400, ease: "easeOut" },
  },
};

const headerMotion = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { delay: 250, duration: 300 } },
};

const getCardMotion = () => ({
  initial: { opacity: 0, y: 30, scale: 0.9 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0, duration: 300, ease: "easeOut" },
  },
  hover: { scale: 1.02, transition: { duration: 200 } },
});

const customizationContainerMotion = {
  initial: { opacity: 0, y: 30 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { delay: 300, duration: 300, ease: "easeOut" },
  },
};

// Bits have no universal floor; the real gate is the chosen voice's own cost
// (as low as the cheapest voice). The redeem value only auto-grants a budget for
// channel-point/sub activations, so the bits card is framed around per-voice cost.
const activationMethods = computed(() => [
  {
    title: "With Bits",
    icon: Heart,
    description: `Cheer at least your chosen voice's cost; some voices are as low as ${voiceStore.minCost} bits.`,
    colorTheme: "primary",
    command: [
      { text: "Cheer<cost> ", class: "text-primary-300" },
      { text: "[voicename] ", class: "text-secondary-400" },
      { text: "your message", class: "text-gray-300" },
    ],
  },
  {
    title: "With Channel Points",
    icon: Gift,
    description: 'Redeem the "TTS Message" reward, no bits required.',
    colorTheme: "secondary",
    command: [
      { text: "[voicename] ", class: "text-secondary-400" },
      { text: "your message", class: "text-gray-300" },
    ],
  },
  {
    title: "Subscriber Perk",
    icon: RotateCcw,
    description: "Your resub message gets a free TTS reading!",
    colorTheme: "accent",
    tiers: [
      {
        name: "Tier 1 Resub",
        value: `${configStore.resubTierBits["1"]} Bit Value`,
        class: "text-primary-300",
        badgeClass: "bg-primary-900/40",
      },
      {
        name: "Tier 2 Resub",
        value: `${configStore.resubTierBits["2"]} Bit Value`,
        class: "text-secondary-300",
        badgeClass: "bg-secondary-900/40",
      },
      {
        name: "Tier 3 Resub",
        value: `${configStore.resubTierBits["3"]} Bit Value`,
        class: "text-accent-300",
        badgeClass: "bg-accent-900/40",
      },
    ],
  },
]);

const customizationCommands = [
  {
    title: "Choose a Voice",
    icon: Plus,
    description: "Pin a default voice (and optionally a model) for your messages.",
    colorTheme: "primary",
    command: [
      { text: "!setvoice ", class: "text-primary-300" },
      { text: "voicename", class: "text-secondary-400" },
      { text: ":model", class: "text-gray-500" },
    ],
    hint: "Model is optional, e.g. !setvoice wise:v3",
  },
  {
    title: "Reset Your Voice",
    icon: X,
    description: "Revert to the channel's default voice.",
    colorTheme: "secondary",
    command: [{ text: "!clearvoice", class: "text-secondary-300" }],
  },
];

// Score/leaderboard/vote families only appear when the streamer has them enabled
// (each is independently config-gated and off during Stage Mode). "commands" cards
// list things you type; "votes" cards render paired up/down choices.
type ChatCommandItem = { cmd: string; desc: string; tone?: "up" | "down" };
type ChatCommandGroup = {
  title: string;
  description: string;
  icon: Component;
  colorTheme: "primary" | "secondary" | "accent";
  variant: "commands" | "votes";
  items: ChatCommandItem[];
};

const chatCommandGroups = computed(() => {
  const groups: ChatCommandGroup[] = [];

  if (configStore.commands.scoreLookup) {
    groups.push({
      title: "Check Scores",
      description: "Look up your rank and the leaderboard.",
      icon: Trophy,
      colorTheme: "primary",
      variant: "commands",
      items: [
        { cmd: "!ttsscore", desc: "your score (also !myscore, !score)" },
        { cmd: "!leaderboard", desc: "top players (also !ttstop)" },
        { cmd: "!ttsbottom", desc: "the bottom of the board" },
      ],
    });
  }

  if (configStore.commands.scoreVotes) {
    groups.push({
      title: "Rate a Message",
      description: "Swing the score on whatever's playing.",
      icon: Heart,
      colorTheme: "secondary",
      variant: "votes",
      items: [
        { cmd: "+2", desc: "upvote what's playing now", tone: "up" },
        { cmd: "-2", desc: "downvote what's playing now", tone: "down" },
      ],
    });
  }

  if (configStore.commands.skipVotes) {
    groups.push({
      title: "Skip Votes",
      description: "Hate the current message? Skip. Love it? Stay.",
      icon: SkipForward,
      colorTheme: "accent",
      variant: "votes",
      items: [
        { cmd: "Stay", desc: "keep it playing", tone: "up" },
        { cmd: "Skip", desc: "enough Skips cut what's playing", tone: "down" },
      ],
    });
  }

  return groups;
});

const showChatCommands = computed(() => chatCommandGroups.value.length > 0);

const goodToKnow = [
  {
    title: "Animated messages read free",
    icon: Sparkles,
    colorTheme: "secondary",
    text: "Paid animated chat messages (Twitch Message Effects) get read aloud automatically, even with no bits.",
  },
  {
    title: "Some words are always filtered",
    icon: ShieldAlert,
    colorTheme: "accent",
    text: 'A built-in filter always replaces blocked words with "Filtered xdx", no matter the channel\'s other settings.',
  },
];

// card style helpers
const getCardClasses = (theme: string) => {
  const baseClasses = "glass rounded-2xl p-6 transition-all duration-300";
  switch (theme) {
    case "primary":
      return `${baseClasses} border-2 border-primary-500/30 hover:border-primary-500/60`;
    case "secondary":
      return `${baseClasses} border-2 border-secondary-500/30 hover:border-secondary-500/60`;
    case "accent":
      return `${baseClasses} border-2 border-accent-500/30 hover:border-accent-500/60`;
    default:
      return `${baseClasses} border-2 border-primary-500/30 hover:border-primary-500/60`;
  }
};

const getIconWrapperClasses = (theme: string) => {
  switch (theme) {
    case "primary":
      return "bg-primary-600";
    case "secondary":
      return "bg-secondary-600";
    case "accent":
      return "bg-accent-500";
    default:
      return "bg-primary-600";
  }
};

const getCommandClasses = (theme: string) => {
  const baseClasses = "bg-dark-900/50 rounded-lg p-3 font-mono text-sm";
  switch (theme) {
    case "primary":
      return `${baseClasses} border-2 border-primary-500/20`;
    case "secondary":
      return `${baseClasses} border-2 border-secondary-500/20`;
    case "accent":
      return `${baseClasses} border-2 border-accent-500/20`;
    default:
      return `${baseClasses} border-2 border-primary-500/20`;
  }
};

// Theme-tinted border for the mono pills in "commands" cards.
const getCommandPillClasses = (theme: string) => {
  switch (theme) {
    case "secondary":
      return "border-secondary-500/30";
    case "accent":
      return "border-accent-500/30";
    default:
      return "border-primary-500/30";
  }
};

// Up = positive (emerald), down = negative (rose). Items are ordered positive-first
// in every votes card, so green always sits on top and red below — the color never
// flips meaning between cards.
const getVoteChipClasses = (tone?: "up" | "down") =>
  tone === "down"
    ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
</script>
