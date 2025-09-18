# Use Node.js 20 (Alpine for smaller size)
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# ----------------------------
# Production image
# ----------------------------
FROM node:20-alpine

WORKDIR /app

# Only copy package.json & built files to reduce size
COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

# Start the app
CMD ["node", "dist/index.js"]
