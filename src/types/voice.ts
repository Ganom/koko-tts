export interface Voice {
  name: string;
  text: string;
  cost: number;
  priority?: boolean;
  kind?: "real" | "random";
}

export interface VoiceMap {
  [key: string]: Omit<Voice, "name">;
}
