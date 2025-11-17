interface DiscordRequestOptions {
  method?: string;
  body?: Record<string, unknown>;
}

export async function DiscordRequest(
  endpoint: string,
  options: DiscordRequestOptions = {},
): Promise<Response> {
  const url = "https://discord.com/api/v10/" + endpoint;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent":
        "DiscordBot (https://github.com/marcjulianschwarz/mc-server-discord, 1.0.0)",
    },
    ...options,
    body: JSON.stringify(options.body),
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Send a message to a Discord channel
 */
export async function sendChannelMessage(
  channelId: string,
  content: string,
): Promise<Response | undefined> {
  const endpoint = `channels/${channelId}/messages`;
  try {
    const res = await DiscordRequest(endpoint, {
      method: "POST",
      body: {
        content: content,
      },
    });
    console.log(`Message sent to channel ${channelId}: ${content}`);
    return res;
  } catch (err) {
    console.error("Error sending message:", err);
  }
}
