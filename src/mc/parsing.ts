import { ParsedLog } from "./entity";
import {
  isUserChatMessage,
  isUserJoinedMessage,
  isUserLeftMessage,
  isAdvancementMessage,
} from "./message";

export function parseMinecraftLog(logLine: string): ParsedLog | null {
  const parts = logLine.split("]: ");
  if (parts.length < 2) return null;

  const content = parts.slice(1).join("").trim();

  if (isUserChatMessage(content)) {
    const chatMatch = content.match(/<([^>]+)>\s*(.+)/);
    if (chatMatch) {
      const playerName = chatMatch[1];
      const message = chatMatch[2];
      return {
        type: "chat",
        playerName,
        message,
        fullMessage: `**${playerName}:** ${message}`,
      };
    }
  }

  if (isUserJoinedMessage(content)) {
    const playerName = content.split(" joined the game")[0].trim();
    return {
      type: "join",
      playerName,
      fullMessage: `**${playerName}** joined the game`,
    };
  }

  if (isUserLeftMessage(content)) {
    const playerName = content.split(" left the game")[0].trim();
    return {
      type: "leave",
      playerName,
      fullMessage: `**${playerName}** left the game`,
    };
  }

  if (isAdvancementMessage(content)) {
    const advMatch = content.match(
      /^(\S+)\s+has made the advancement \[(.+)\]/,
    );
    if (advMatch) {
      return {
        type: "advancement",
        playerName: advMatch[1],
        advancement: advMatch[2],
        fullMessage: `🎉 **${advMatch[1]}** has made the advancement **[${advMatch[2]}]**`,
      };
    }
  }

  return null;
}
