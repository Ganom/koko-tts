<template>
  <div class="max-w-6xl mx-auto mb-16">
    <!-- Main Info Section -->
    <div class="anime-card bg-gradient-dark rounded-4xl p-8 mb-8 border border-violet-700/30">
      <div class="text-center mb-8">
        <h2 class="text-gradient text-3xl font-bold mb-3">How to Use TTS</h2>
        <p class="text-gray-300 text-lg">Multiple ways to make your messages come alive with voice</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <!-- Cheer Method -->
        <div class="glass rounded-2xl p-6 border border-violet-700/30 hover:border-violet-500/60 transition-all duration-300">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <HeartIcon class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-white font-bold text-xl">Cheer</h3>
          </div>
          <p class="text-gray-300 mb-3">Use bits to activate TTS</p>
          <div class="bg-dark-900/50 border border-violet-700/20 rounded-lg p-3 font-mono text-sm">
            <span class="text-violet-300">Cheer300 </span>
            <span class="text-pink-400">[voicename] </span>
            <span class="text-gray-300">your message</span>
          </div>
        </div>

        <!-- Channel Points Method -->
        <div class="glass rounded-2xl p-6 border border-pink-700/30 hover:border-pink-500/60 transition-all duration-300">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <GiftIcon class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-white font-bold text-xl">Channel Points</h3>
          </div>
          <p class="text-gray-300 mb-3">Redeem TTS reward</p>
          <div class="bg-dark-900/50 border border-pink-700/20 rounded-lg p-3 font-mono text-sm">
            <span class="text-pink-400">[voicename] </span>
            <span class="text-gray-300">your message</span>
          </div>
        </div>

        <!-- Resub Method -->
        <div class="glass rounded-2xl p-6 border border-gold-700/30 hover:border-gold-500/60 transition-all duration-300">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <ArrowPathIcon class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-white font-bold text-xl">Resub</h3>
          </div>
          <p class="text-gray-300 mb-3">Automatic bit values</p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-violet-300">Tier 1</span>
              <span class="bg-violet-900/40 px-2 py-1 rounded text-white">500 bits</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-pink-300">Tier 2</span>
              <span class="bg-pink-900/40 px-2 py-1 rounded text-white">1000 bits</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gold-300">Tier 3</span>
              <span class="bg-gold-900/40 px-2 py-1 rounded text-white">2500 bits</span>
            </div>
          </div>
        </div>

        <!-- Set Voice Command -->
        <div class="glass rounded-2xl p-6 border border-violet-700/30 hover:border-violet-500/60 transition-all duration-300">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <PlusIcon class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-white font-bold text-xl">Set Voice</h3>
          </div>
          <p class="text-gray-300 mb-3">Set your default voice</p>
          <div class="bg-dark-900/50 border border-violet-700/20 rounded-lg p-3 font-mono text-sm">
            <span class="text-violet-300">!setvoice </span>
            <span class="text-pink-400">voicename</span>
          </div>
        </div>

        <!-- Clear Voice Command -->
        <div class="glass rounded-2xl p-6 border border-pink-700/30 hover:border-pink-500/60 transition-all duration-300">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <XMarkIcon class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-white font-bold text-xl">Clear Voice</h3>
          </div>
          <p class="text-gray-300 mb-3">Reset to default voice</p>
          <div class="bg-dark-900/50 border border-pink-700/20 rounded-lg p-3 font-mono text-sm">
            <span class="text-pink-300">!clearvoice</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HeartIcon,
  GiftIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'

// Info box component with usage instructions
</script>
