export interface AudioState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
}

export interface AudioPlayer {
  audio: HTMLAudioElement | null
  voiceName: string
  state: AudioState
}

export enum PlaybackStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  PLAYING = 'playing',
  PAUSED = 'paused',
  ERROR = 'error'
}