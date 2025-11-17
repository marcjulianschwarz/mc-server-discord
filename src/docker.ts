import Docker from "dockerode";

export default async function monitorDockerLogs(
  containerName: string,
  handler: (logLine: string) => Promise<void>,
): Promise<void> {
  try {
    const docker = new Docker({ socketPath: "/var/run/docker.sock" });
    const container = docker.getContainer(containerName);

    // Check if container exists
    await container.inspect();
    console.log(`Monitoring logs for container: ${containerName}`);

    console.log(`Attempting to attach to log stream...`);
    const logStream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
      timestamps: false,
    });

    console.log(`Log stream attached successfully`);

    logStream.on("data", async (chunk: Buffer) => {
      // Docker log format: first 8 bytes are header
      // Byte 0: stream type (1=stdout, 2=stderr)
      // Bytes 4-7: payload size
      const payload = chunk.subarray(8);

      let logLine = payload.toString("utf8").trim();

      // Remove any leading control characters (like 'K')
      logLine = logLine.replace(/^[^\[]*/, "");
      if (!logLine) return;
      await handler(logLine);
    });

    logStream.on("error", (err: Error) => {
      console.error(`Error streaming logs from ${containerName}:`, err);
    });
  } catch (err) {
    const error = err as Error;
    console.error(
      `Failed to monitor container ${containerName}:`,
      error.message,
    );
  }
}
