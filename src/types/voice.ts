export interface Voice {
  name: string
  text: string
  cost: number
}

export interface VoiceMap {
  [key: string]: Omit<Voice, 'name'>
}
