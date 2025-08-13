import type {ComputedRef, Ref} from 'vue';
import {computed, ref} from 'vue';
import {PlaybackStatus} from '@/types/audio';

export interface UseAudioReturn {
  currentlyPlaying: ComputedRef<HTMLAudioElement | null>;
  playbackStatus: Ref<Map<string, PlaybackStatus>>;
  play: (voiceName: string) => Promise<void>;
  pause: (voiceName: string) => void;
  stop: () => void;
  isPlaying: (voiceName: string) => boolean;
}

export function useAudio(): UseAudioReturn {
  // --- STATE ---

  const currentlyPlayingVoiceName = ref<string | null>(null);
  const playbackStatus = ref(new Map<string, PlaybackStatus>());
  const audioCache = new Map<string, HTMLAudioElement>();

  // --- GETTERS (COMPUTED) ---

  const currentlyPlaying = computed(() => {
    const voiceName = currentlyPlayingVoiceName.value;
    return voiceName ? audioCache.get(voiceName) ?? null : null;
  });

  // --- HELPERS ---

  const setStatus = (voiceName: string, status: PlaybackStatus) => {
    playbackStatus.value.set(voiceName, status);
  };

  const _setupAudioEvents = (audio: HTMLAudioElement, voiceName: string) => {
    audio.addEventListener('ended', () => {
      setStatus(voiceName, PlaybackStatus.IDLE);
      if (currentlyPlayingVoiceName.value === voiceName) {
        currentlyPlayingVoiceName.value = null;
      }
    });

    audio.addEventListener('error', (e) => {
      setStatus(voiceName, PlaybackStatus.ERROR);
      console.error(`Error loading audio for "${voiceName}":`, e);
    });
  };

  const getOrCreateAudio = (voiceName: string): HTMLAudioElement => {
    if (!audioCache.has(voiceName)) {
      const audio = new Audio(`/audio/${voiceName.toLowerCase()}.mp3`);
      audio.volume = 0.5;
      _setupAudioEvents(audio, voiceName);
      audioCache.set(voiceName, audio);
    }
    return audioCache.get(voiceName)!;
  };

  // --- ACTIONS ---

  const play = async (voiceName: string): Promise<void> => {
    const previousVoiceName = currentlyPlayingVoiceName.value;

    if (previousVoiceName && previousVoiceName !== voiceName) {
      pause(previousVoiceName);
    }

    const audio = getOrCreateAudio(voiceName);

    try {
      setStatus(voiceName, PlaybackStatus.LOADING);
      await audio.play();
      setStatus(voiceName, PlaybackStatus.PLAYING);
      currentlyPlayingVoiceName.value = voiceName;
    } catch (error) {
      setStatus(voiceName, PlaybackStatus.ERROR);
      console.error(`Error playing audio for "${voiceName}":`, error);
      currentlyPlayingVoiceName.value = null;
      throw error;
    }
  };

  const pause = (voiceName: string): void => {
    const audio = audioCache.get(voiceName);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setStatus(voiceName, PlaybackStatus.IDLE);
      if (currentlyPlayingVoiceName.value === voiceName) {
        currentlyPlayingVoiceName.value = null;
      }
    }
  };

  const stop = (): void => {
    if (currentlyPlayingVoiceName.value) {
      pause(currentlyPlayingVoiceName.value);
    }
  };

  const isPlaying = (voiceName: string): boolean => {
    return playbackStatus.value.get(voiceName) === PlaybackStatus.PLAYING;
  };

  return {
    currentlyPlaying,
    playbackStatus,
    play,
    pause,
    stop,
    isPlaying,
  };
}
