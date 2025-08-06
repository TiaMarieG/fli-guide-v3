# Stage 1: Build the React app using Vite
FROM node:20-slim AS build

# Install dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --no-fund --no-audit --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve the built app with Nginx
FROM nginx:alpine

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]