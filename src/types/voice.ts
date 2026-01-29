export interface Voice {
  name: string;
  text: string;
  cost: number;
  limited?: boolean;
  kind?: "real" | "random";
}

export interface VoiceMap {
  [key: string]: Omit<Voice, "name">;
}
