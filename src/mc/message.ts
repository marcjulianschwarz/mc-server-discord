export function isUserChatMessage(msg: string): boolean {
  return msg.includes("<") && msg.includes(">");
}

export function isUserJoinedMessage(msg: string): boolean {
  return msg.includes("joined the game");
}

export function isUserLeftMessage(msg: string): boolean {
  return msg.includes("left the game");
}

export function isAdvancementMessage(msg: string): boolean {
  return msg.includes("has made the advancement");
}
