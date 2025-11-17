import express from "express";
import monitorDockerLogs from "./docker";
import { minecraftDockerHandler } from "./mc/handler";

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Listening on port", PORT);

  if (!process.env.DOCKER_CONTAINER_NAME) {
    console.log(
      "Docker log monitoring disabled. Set DOCKER_CONTAINER_NAME to enable",
    );
    return;
  }

  const channels = {
    chat: process.env.MC_CHAT_CHANNEL_ID,
    coords: process.env.MC_COORDS_CHANNEL_ID,
    yay: process.env.MC_YAY_CHANNEL_ID,
    notify: process.env.MC_NOTIFY_CHANNEL_ID,
  };

  const hasChannels = Object.values(channels).some((id) => id);

  if (!hasChannels) {
    console.log(
      "Minecraft log monitoring disabled. Set at least one MC_*_CHANNEL_ID variable",
    );
    return;
  }

  console.log(
    `Starting Minecraft log monitoring for: ${process.env.DOCKER_CONTAINER_NAME}`,
  );
  console.log(`Configured channels:`, {
    chat: channels.chat || "not set",
    coords: channels.coords || "not set",
    achievements: channels.yay || "not set",
    notifications: channels.notify || "not set",
  });

  monitorDockerLogs(process.env.DOCKER_CONTAINER_NAME, (logLine) =>
    minecraftDockerHandler(logLine, channels),
  );
});
