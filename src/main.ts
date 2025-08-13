import "./assets/main.css";

import { MotionPlugin } from "@vueuse/motion";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { useTheme } from "./composables/useTheme";

const app = createApp(App);

app.use(createPinia());
app.use(MotionPlugin);

// Initialize theme before mounting
const { initTheme } = useTheme();
initTheme();

app.mount("#app");
