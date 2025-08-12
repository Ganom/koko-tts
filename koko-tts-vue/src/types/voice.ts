export interface Voice {
  name: string
  text: string
  cost: number
}

export interface VoiceMap {
  [key: string]: Omit<Voice, 'name'>
}

export interface GroupedVoices {
  [cost: number]: Voice[]
}

export enum TierLevel {
  T1 = 'T1 Resub',
  T2 = 'T2 Resub',
  T3 = 'T3 Resub'
}

export interface VoiceSection {
  title: string
  voices: Voice[]
  isPremium: boolean
}