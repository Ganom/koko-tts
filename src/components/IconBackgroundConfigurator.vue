<script setup lang="ts">
import { computed, ref } from "vue";
import { getAvailableIconNames } from "@/utils/iconRegistry";

interface BackgroundConfig {
  icons: string[];
  iconSize: number;
  gap: number;
  opacity: number;
  color: string;
  randomRotation: boolean;
  randomOpacity: boolean;
  randomColors: boolean;
  enableAnimation: boolean;
  animationSpeed: number;
  enableSlideAnimation: boolean;
  slideAnimationSpeed: number;
  slideDirection: "right" | "left" | "down" | "up" | "diagonal-down-right" | "diagonal-up-left";
}

const props = defineProps<{
  modelValue: BackgroundConfig;
}>();

const emit = defineEmits<{
  "update:modelValue": [config: BackgroundConfig];
}>();

const showConfigurator = ref(false);

const config = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const availableIcons = getAvailableIconNames();

const presets = [
  {
    name: "Tech",
    icons: [
      "Terminal",
      "Cpu",
      "Server",
      "Code",
      "Wifi",
      "Cloud",
      "Globe",
      "ShieldCheck",
      "Zap",
      "Signal",
    ],
    color: "#60a5fa",
  },
  {
    name: "Creative",
    icons: [
      "Sparkles",
      "Star",
      "Heart",
      "Camera",
      "Image",
      "Film",
      "Music",
      "Megaphone",
      "Palette",
      "Lightbulb",
    ],
    color: "#f472b6",
  },
  {
    name: "Business",
    icons: [
      "Briefcase",
      "BarChart3",
      "PieChart",
      "Building2",
      "CreditCard",
      "FileText",
      "Scale",
      "Trophy",
      "Users",
      "Clipboard",
    ],
    color: "#34d399",
  },
  {
    name: "Science",
    icons: [
      "Beaker",
      "GraduationCap",
      "Calculator",
      "Search",
      "Lightbulb",
      "Globe",
      "BookOpen",
      "Puzzle",
      "Flame",
      "Zap",
    ],
    color: "#fbbf24",
  },
];

const updateConfig = (key: keyof BackgroundConfig, value: any) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value,
  });
};

const toggleIcon = (iconName: string) => {
  const currentIcons = [...props.modelValue.icons];
  const index = currentIcons.indexOf(iconName);
  if (index > -1) {
    currentIcons.splice(index, 1);
  } else {
    currentIcons.push(iconName);
  }
  updateConfig("icons", currentIcons);
};

const applyPreset = (preset: (typeof presets)[0]) => {
  emit("update:modelValue", {
    ...props.modelValue,
    icons: [...preset.icons],
    color: preset.color,
  });
};

const exportConfig = () => {
  const configString = JSON.stringify(props.modelValue, null, 2);
  navigator.clipboard.writeText(configString);
  alert("Configuration copied to clipboard!");
};
</script>

<template>
  <div>
    <!-- Configuration Button -->
    <button
      @click="showConfigurator = !showConfigurator"
      class="bg-gray-800 text-white p-3 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        ></path>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        ></path>
      </svg>
    </button>

    <!-- Configuration Modal -->
    <Transition name="slide">
      <div
        v-if="showConfigurator"
        class="fixed right-0 top-0 h-full w-96 bg-gray-900 shadow-2xl overflow-y-auto z-[60]"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-white">Background Configuration</h2>
            <button @click="showConfigurator = false" class="text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Presets -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-400 mb-3">Presets</h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="preset in presets"
                :key="preset.name"
                @click="applyPreset(preset)"
                class="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm"
              >
                {{ preset.name }}
              </button>
            </div>
          </div>

          <!-- Controls -->
          <div class="space-y-4">
            <!-- Icon Size -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">
                Icon Size: {{ config.iconSize }}px
              </label>
              <input
                :value="config.iconSize"
                @input="updateConfig('iconSize', Number(($event.target as HTMLInputElement).value))"
                type="range"
                min="20"
                max="80"
                class="w-full"
              />
            </div>

            <!-- Gap -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">
                Gap: {{ config.gap }}px
              </label>
              <input
                :value="config.gap"
                @input="updateConfig('gap', Number(($event.target as HTMLInputElement).value))"
                type="range"
                min="10"
                max="80"
                class="w-full"
              />
            </div>

            <!-- Opacity -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">
                Opacity: {{ (config.opacity * 100).toFixed(0) }}%
              </label>
              <input
                :value="config.opacity"
                @input="updateConfig('opacity', Number(($event.target as HTMLInputElement).value))"
                type="range"
                min="0.01"
                max="0.3"
                step="0.01"
                class="w-full"
              />
            </div>

            <!-- Color -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Color</label>
              <div class="flex gap-2">
                <input
                  :value="config.color"
                  @input="updateConfig('color', ($event.target as HTMLInputElement).value)"
                  type="color"
                  class="h-10 w-20 bg-gray-800 border border-gray-700 rounded cursor-pointer"
                />
                <input
                  :value="config.color"
                  @input="updateConfig('color', ($event.target as HTMLInputElement).value)"
                  type="text"
                  class="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <!-- Toggles -->
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-gray-400">
                <input
                  :checked="config.randomRotation"
                  @change="
                    updateConfig('randomRotation', ($event.target as HTMLInputElement).checked)
                  "
                  type="checkbox"
                  class="rounded bg-gray-800 border-gray-700"
                />
                <span class="text-sm">Random Rotation</span>
              </label>
              <label class="flex items-center gap-2 text-gray-400">
                <input
                  :checked="config.randomOpacity"
                  @change="
                    updateConfig('randomOpacity', ($event.target as HTMLInputElement).checked)
                  "
                  type="checkbox"
                  class="rounded bg-gray-800 border-gray-700"
                />
                <span class="text-sm">Random Opacity</span>
              </label>
              <label class="flex items-center gap-2 text-gray-400">
                <input
                  :checked="config.randomColors"
                  @change="
                    updateConfig('randomColors', ($event.target as HTMLInputElement).checked)
                  "
                  type="checkbox"
                  class="rounded bg-gray-800 border-gray-700"
                />
                <span class="text-sm">Random Theme Colors</span>
              </label>
              <label class="flex items-center gap-2 text-gray-400">
                <input
                  :checked="config.enableAnimation"
                  @change="
                    updateConfig('enableAnimation', ($event.target as HTMLInputElement).checked)
                  "
                  type="checkbox"
                  class="rounded bg-gray-800 border-gray-700"
                />
                <span class="text-sm">Rotate Animation</span>
              </label>
              <label class="flex items-center gap-2 text-gray-400">
                <input
                  :checked="config.enableSlideAnimation"
                  @change="
                    updateConfig(
                      'enableSlideAnimation',
                      ($event.target as HTMLInputElement).checked,
                    )
                  "
                  type="checkbox"
                  class="rounded bg-gray-800 border-gray-700"
                />
                <span class="text-sm">Slide Animation</span>
              </label>
            </div>

            <!-- Animation Speed (only show when rotation animation is enabled) -->
            <div v-if="config.enableAnimation">
              <label class="block text-sm font-medium text-gray-400 mb-2">
                Rotation Speed: {{ config.animationSpeed.toFixed(1) }}x
              </label>
              <input
                :value="config.animationSpeed"
                @input="
                  updateConfig('animationSpeed', Number(($event.target as HTMLInputElement).value))
                "
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                class="w-full"
              />
            </div>

            <div v-if="config.enableSlideAnimation" class="space-y-4">
              <!-- Slide Direction -->
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">
                  Slide Direction
                </label>
                <select
                  :value="config.slideDirection"
                  @change="
                    updateConfig('slideDirection', ($event.target as HTMLSelectElement).value)
                  "
                  class="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="right">Right →</option>
                  <option value="left">Left ←</option>
                  <option value="down">Down ↓</option>
                  <option value="up">Up ↑</option>
                  <option value="diagonal-down-right">Diagonal ↘</option>
                  <option value="diagonal-up-left">Diagonal ↖</option>
                </select>
              </div>

              <!-- Slide Speed -->
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">
                  Slide Speed: {{ config.slideAnimationSpeed.toFixed(1) }}x
                </label>
                <input
                  :value="config.slideAnimationSpeed"
                  @input="
                    updateConfig(
                      'slideAnimationSpeed',
                      Number(($event.target as HTMLInputElement).value),
                    )
                  "
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  class="w-full"
                />
              </div>
            </div>

            <!-- Export Button -->
            <button
              @click="exportConfig"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Export Configuration
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
