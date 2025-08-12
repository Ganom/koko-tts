import type {Ref, ShallowRef} from 'vue'
import {ref, shallowRef} from 'vue'
import {PlaybackStatus} from '@/types/audio'

export interface UseAudioReturn {
  currentlyPlaying: ShallowRef<HTMLAudioElement | null>
  playbackStatus: Ref<Map<string, PlaybackStatus>>
  play: (voiceName: string) => Promise<void>
  pause: (voiceName: string) => void
  stop: () => void
  isPlaying: (voiceName: string) => boolean
}

export function useAudio(): UseAudioReturn {
  const currentlyPlaying = shallowRef<HTMLAudioElement | null>(null)
  const playbackStatus = ref(new Map<string, PlaybackStatus>())
  const audioCache = new Map<string, HTMLAudioElement>()

  const getOrCreateAudio = (voiceName: string): HTMLAudioElement => {
    if (!audioCache.has(voiceName)) {
      const audio = new Audio(`/audio/${voiceName.toLowerCase()}.mp3`)
      audio.volume = 0.5
      audioCache.set(voiceName, audio)

      audio.addEventListener('ended', () => {
        playbackStatus.value.set(voiceName, PlaybackStatus.IDLE)
        if (currentlyPlaying.value === audio) {
          currentlyPlaying.value = null
        }
      })

      audio.addEventListener('error', () => {
        playbackStatus.value.set(voiceName, PlaybackStatus.ERROR)
        console.error(`Error loading audio for ${voiceName}`)
      })
    }
    return audioCache.get(voiceName)!
  }

  const play = async (voiceName: string): Promise<void> => {
    const audio = getOrCreateAudio(voiceName)

    if (currentlyPlaying.value && currentlyPlaying.value !== audio) {
      // Find the previously playing voice and update its status
      for (const [prevVoiceName, prevAudio] of audioCache.entries()) {
        if (prevAudio === currentlyPlaying.value) {
          playbackStatus.value.set(prevVoiceName, PlaybackStatus.IDLE)
          break
        }
      }
      currentlyPlaying.value.pause()
      currentlyPlaying.value.currentTime = 0
    }

    try {
      playbackStatus.value.set(voiceName, PlaybackStatus.LOADING)
      await audio.play()
      playbackStatus.value.set(voiceName, PlaybackStatus.PLAYING)
      currentlyPlaying.value = audio
    } catch (error) {
      playbackStatus.value.set(voiceName, PlaybackStatus.ERROR)
      throw error
    }
  }

  const pause = (voiceName: string): void => {
    const audio = audioCache.get(voiceName)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      playbackStatus.value.set(voiceName, PlaybackStatus.PAUSED)
      if (currentlyPlaying.value === audio) {
        currentlyPlaying.value = null
      }
    }
  }

  const stop = (): void => {
    if (currentlyPlaying.value) {
      currentlyPlaying.value.pause()
      currentlyPlaying.value.currentTime = 0
      currentlyPlaying.value = null
    }
  }

  const isPlaying = (voiceName: string): boolean => {
    return playbackStatus.value.get(voiceName) === PlaybackStatus.PLAYING
  }

  return {
    currentlyPlaying,
    playbackStatus,
    play,
    pause,
    stop,
    isPlaying
  }
}
