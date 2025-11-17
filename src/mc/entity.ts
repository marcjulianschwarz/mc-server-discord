export interface ParsedLog {
  type: "chat" | "join" | "leave" | "advancement";
  playerName: string;
  message?: string;
  advancement?: string;
  fullMessage: string;
}

export interface Channels {
  chat?: string;
  coords?: string;
  yay?: string;
  notify?: string;
}
