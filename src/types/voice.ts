export interface Voice {
  name: string;
  text: string;
  cost: number;
  limited?: boolean;
}

export interface VoiceMap {
  [key: string]: Omit<Voice, "name">;
}
