# Use official Node.js slim image for better compatibility
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --no-fund --no-audit --legacy-peer-deps

# Copy all backend source files
COPY . .

# Make wait-for.sh executable
RUN chmod +x wait-for.sh

# Expose your backend port
EXPOSE 5025

# Wait for MySQL to be ready, then start server
CMD ["sh", "-c", "./wait-for.sh"]
