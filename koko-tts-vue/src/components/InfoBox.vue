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
            <div class="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
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
            <div class="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
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
            <div class="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-dark-900" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
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
            <div class="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
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
            <div class="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
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
// Info box component with usage instructions
</script>
