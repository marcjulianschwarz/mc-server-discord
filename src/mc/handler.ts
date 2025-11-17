import { sendChannelMessage } from "../discord";
import { ParsedLog, Channels } from "./entity";
import { parseMinecraftLog } from "./parsing";

export async function handleUserChatMessage(
  log: ParsedLog,
  channels: Channels,
) {
  // Check if message starts with "coords" or "cord" (with optional colon) or contains coordinate pattern
  const lowerMessage = log.message!.toLowerCase();
  const startsWithCoords =
    lowerMessage.startsWith("coords") || lowerMessage.startsWith("cord");
  // Pattern for numbers separated by spaces anywhere in the message (like "forest 230 12" or "23 345")
  const hasCoordPattern = /-?\d+\s+-?\d+/.test(log.message!);

  if (startsWithCoords || hasCoordPattern) {
    // Remove "coords", "cord", "cords" prefix (with optional colon and spaces) if present
    let coordsMessage = log
      .message!.replace(/^(coords?|cords?)[::\s]*/i, "")
      .trim();

    if (channels.coords && coordsMessage) {
      await sendChannelMessage(
        channels.coords,
        `📍 **${log.playerName}:** ${coordsMessage}`,
      );
    }
  } else {
    // Regular chat message
    if (channels.chat) {
      await sendChannelMessage(channels.chat, log.fullMessage);
    }
  }
}

export async function handleParsedLog(log: ParsedLog, channels: Channels) {
  switch (log.type) {
    case "chat": {
      await handleUserChatMessage(log, channels);
      break;
    }
    case "advancement": {
      if (channels.yay) {
        await sendChannelMessage(channels.yay, log.fullMessage);
      }
      break;
    }
    case "join":
    case "leave": {
      if (channels.notify) {
        await sendChannelMessage(channels.notify, log.fullMessage);
      }
      break;
    }
    default: {
      console.log(`Log type ${log.type} is not known.`);
    }
  }
}

export async function minecraftDockerHandler(
  logLine: string,
  channels: Channels,
) {
  const parsed = parseMinecraftLog(logLine);
  if (!parsed) return;

  console.log(
    `[DEBUG] Parsed type: ${parsed.type}, Player: ${parsed.playerName || "N/A"}`,
  );

  await handleParsedLog(parsed, channels);
}
