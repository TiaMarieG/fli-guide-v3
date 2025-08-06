# Use official Node.js LTS Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --no-fund --no-audit --legacy-peer-deps

# Copy all backend source files
COPY . .

# Make wait-for.sh executable
RUN chmod +x wait-for.sh

# Expose your backend port (change if needed)
EXPOSE 5025

# Wait for MySQL to be ready, then start server
CMD ["sh", "-c", "./wait-for.sh db:3306 -- npm run start"]
