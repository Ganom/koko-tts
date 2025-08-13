<template>
  <div class="max-w-6xl mx-auto mb-16">
    <div
      class="bg-gradient-dark rounded-4xl p-8 mb-8 border border-primary-700/30"
      v-motion="containerMotion"
    >
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
            v-for="(method) in activationMethods"
            :key="method.title"
            v-motion="getCardMotion()"
            :class="getCardClasses(method.colorTheme)"
          >
            <div class="flex items-center mb-4">
              <div
                :class="getIconWrapperClasses(method.colorTheme)"
                class="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
              >
                <component :is="method.icon" class="w-6 h-6 text-white"/>
              </div>
              <h3 class="text-white font-bold text-xl">{{ method.title }}</h3>
            </div>
            <p class="text-gray-300 mb-3">{{ method.description }}</p>

            <div v-if="method.command" :class="getCommandClasses(method.colorTheme)">
              <span
                v-for="part in method.command"
                :key="part.text"
                :class="part.class"
              >
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

      <div>
        <h3 class="text-white text-2xl font-semibold mb-6 text-center md:text-left">
          Voice Customization
        </h3>
        <div
          class="glass rounded-2xl p-6 border border-primary-700/30"
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
                  <component :is="command.icon" class="w-6 h-6 text-white"/>
                </div>
                <div>
                  <h3 class="text-white font-bold text-xl">{{ command.title }}</h3>
                  <p class="text-gray-300">{{ command.description }}</p>
                </div>
              </div>
              <div :class="getCommandClasses(command.colorTheme)">
                <span
                  v-for="part in command.command"
                  :key="part.text"
                  :class="part.class"
                >
                  {{ part.text }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowPathIcon,
  GiftIcon,
  HeartIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";

// --- ANIMATIONS ---

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

// --- DATA ---

const activationMethods = [
  {
    title: "With Bits",
    icon: HeartIcon,
    description: "Cheer 300+ bits to activate TTS.",
    colorTheme: "primary",
    command: [
      { text: "Cheer300 ", class: "text-primary-300" },
      { text: "[voicename] ", class: "text-secondary-400" },
      { text: "your message", class: "text-gray-300" },
    ],
  },
  {
    title: "With Channel Points",
    icon: GiftIcon,
    description: 'Redeem the "TTS Message" reward.',
    colorTheme: "secondary",
    command: [
      { text: "[voicename] ", class: "text-secondary-400" },
      { text: "your message", class: "text-gray-300" },
    ],
  },
  {
    title: "Subscriber Perk",
    icon: ArrowPathIcon,
    description: "Your resub message gets a free TTS reading!",
    colorTheme: "accent",
    tiers: [
      {
        name: "Tier 1 Resub",
        value: "500 Bit Value",
        class: "text-primary-300",
        badgeClass: "bg-primary-900/40",
      },
      {
        name: "Tier 2 Resub",
        value: "1000 Bit Value",
        class: "text-secondary-300",
        badgeClass: "bg-secondary-900/40",
      },
      {
        name: "Tier 3 Resub",
        value: "2500 Bit Value",
        class: "text-accent-300",
        badgeClass: "bg-accent-900/40",
      },
    ],
  },
];

const customizationCommands = [
  {
    title: "Choose a Voice",
    icon: PlusIcon,
    description: "Set a default voice for your messages.",
    colorTheme: "primary",
    command: [
      { text: "!setvoice ", class: "text-primary-300" },
      { text: "voicename", class: "text-secondary-400" },
    ],
  },
  {
    title: "Reset Your Voice",
    icon: XMarkIcon,
    description: "Revert to the channel's default voice.",
    colorTheme: "secondary",
    command: [{ text: "!clearvoice", class: "text-secondary-300" }],
  },
];

// --- DYNAMIC STYLING HELPERS ---

const getCardClasses = (theme: string) => {
  const baseClasses = "glass rounded-2xl p-6 transition-all duration-300";
  switch (theme) {
    case "primary":
      return `${baseClasses} border border-primary-700/30 hover:border-primary-500/60`;
    case "secondary":
      return `${baseClasses} border border-secondary-700/30 hover:border-secondary-500/60`;
    case "accent":
      return `${baseClasses} border border-accent-700/30 hover:border-accent-500/60`;
    default:
      return `${baseClasses} border border-primary-700/30 hover:border-primary-500/60`;
  }
};

const getIconWrapperClasses = (theme: string) => {
  switch (theme) {
    case "primary":
      return "bg-primary-600";
    case "secondary":
      return "bg-secondary-600";
    case "accent":
      return "bg-accent-600";
    default:
      return "bg-primary-600";
  }
};

const getCommandClasses = (theme: string) => {
  const baseClasses = "bg-dark-900/50 rounded-lg p-3 font-mono text-sm";
  switch (theme) {
    case "primary":
      return `${baseClasses} border border-primary-700/20`;
    case "secondary":
      return `${baseClasses} border border-secondary-700/20`;
    case "accent":
      return `${baseClasses} border border-accent-700/20`;
    default:
      return `${baseClasses} border border-primary-700/20`;
  }
};
</script>
