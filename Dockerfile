FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Install dependencies (including dev dependencies for build)
RUN npm install

# Copy source files
COPY src ./src

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/app.js"]
