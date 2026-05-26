# Stage 1: Build the application
FROM node:25-alpine3.22 AS builder

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
ARG VITE_PUBLIC_BPL_BACKEND_URL
ENV VITE_PUBLIC_BPL_BACKEND_URL=${VITE_PUBLIC_BPL_BACKEND_URL}
RUN npm run build

# Remove the dev dependencies
RUN npm prune --omit=dev

# Stage 2: Serve the application
FROM nginx:1.29.8-alpine

WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY /nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port and start the server
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
