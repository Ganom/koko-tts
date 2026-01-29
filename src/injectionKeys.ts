import type { InjectionKey } from "vue";
import type { UseAudioReturn } from "@/composables/useAudio";

export const audioKey: InjectionKey<UseAudioReturn> = Symbol("audio");
