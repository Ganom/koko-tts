export interface Voice {
  name: string;
  text: string;
  cost: number;
  limited?: boolean;
  priority?: boolean;
  kind?: "real" | "random";
}

export interface VoiceMap {
  [key: string]: Omit<Voice, "name">;
}
