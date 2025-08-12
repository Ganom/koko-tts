<template>
  <div class="max-w-6xl mx-auto mb-16">
    <div class="anime-card bg-gradient-dark rounded-4xl p-8 mb-8 border border-violet-700/30">
      <div class="text-center mb-8">
        <h2 class="text-gradient text-3xl font-bold mb-3">Make Your Message Heard</h2>
        <p class="text-gray-300 text-lg">Use Bits, Channel Points, or Subs to have your message read
          aloud on stream!</p>
      </div>

      <div class="mb-10">
        <h3 class="text-white text-2xl font-semibold mb-6 text-center md:text-left">Activation
          Methods</h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            class="glass rounded-2xl p-6 border border-violet-700/30 hover:border-violet-500/60 transition-all duration-300">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <HeartIcon class="w-6 h-6 text-white"/>
              </div>
              <h3 class="text-white font-bold text-xl">With Bits</h3>
            </div>
            <p class="text-gray-300 mb-3">Cheer 300+ bits to activate TTS.</p>
            <div
              class="bg-dark-900/50 border border-violet-700/20 rounded-lg p-3 font-mono text-sm">
              <span class="text-violet-300">Cheer300 </span>
              <span class="text-pink-400">[voicename] </span>
              <span class="text-gray-300">&lt;your message&gt;</span>
            </div>
          </div>

          <div
            class="glass rounded-2xl p-6 border border-pink-700/30 hover:border-pink-500/60 transition-all duration-300">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <GiftIcon class="w-6 h-6 text-white"/>
              </div>
              <h3 class="text-white font-bold text-xl">With Channel Points</h3>
            </div>
            <p class="text-gray-300 mb-3">Redeem the "TTS Message" reward.</p>
            <div class="bg-dark-900/50 border border-pink-700/20 rounded-lg p-3 font-mono text-sm">
              <span class="text-pink-400">[voicename] </span>
              <span class="text-gray-300">&lt;your message&gt;</span>
            </div>
          </div>

          <div
            class="glass rounded-2xl p-6 border border-gold-700/30 hover:border-gold-500/60 transition-all duration-300">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <ArrowPathIcon class="w-6 h-6 text-white"/>
              </div>
              <h3 class="text-white font-bold text-xl">Subscriber Perk</h3>
            </div>
            <p class="text-gray-300 mb-3">Your resub message gets a free TTS reading!</p>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-violet-300">Tier 1 Resub</span>
                <span class="bg-violet-900/40 px-2 py-1 rounded text-white">500 Bit Value</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-pink-300">Tier 2 Resub</span>
                <span class="bg-pink-900/40 px-2 py-1 rounded text-white">1000 Bit Value</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gold-300">Tier 3 Resub</span>
                <span class="bg-gold-900/40 px-2 py-1 rounded text-white">2500 Bit Value</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-white text-2xl font-semibold mb-6 text-center md:text-left">Voice
          Customization</h3>

        <div class="glass rounded-2xl p-6 border border-violet-700/30">
          <div class="grid md:grid-cols-2 md:divide-x md:divide-violet-700/30 gap-6 md:gap-0">

            <div class="md:pr-6">
              <div class="flex items-center mb-4">
                <div
                  class="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <PlusIcon class="w-6 h-6 text-white"/>
                </div>
                <div>
                  <h3 class="text-white font-bold text-xl">Choose a Voice</h3>
                  <p class="text-gray-300">Set a default voice for your messages.</p>
                </div>
              </div>
              <div
                class="bg-dark-900/50 border border-violet-700/20 rounded-lg p-3 font-mono text-sm">
                <span class="text-violet-300">!setvoice </span>
                <span class="text-pink-400">&lt;voicename&gt;</span>
              </div>
            </div>

            <div class="md:pl-6">
              <div class="flex items-center mb-4">
                <div
                  class="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <XMarkIcon class="w-6 h-6 text-white"/>
                </div>
                <div>
                  <h3 class="text-white font-bold text-xl">Reset Your Voice</h3>
                  <p class="text-gray-300">Revert to the channel's default voice.</p>
                </div>
              </div>
              <div
                class="bg-dark-900/50 border border-pink-700/20 rounded-lg p-3 font-mono text-sm">
                <span class="text-pink-300">!clearvoice</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {ArrowPathIcon, GiftIcon, HeartIcon, PlusIcon, XMarkIcon} from '@heroicons/vue/24/solid'

// Info box component with usage instructions
</script>
