# Build stage: install workspaces, generate prisma, build web
FROM node:22-alpine AS builder

WORKDIR /app

# Corepack enables Yarn via Node images (in case it's disabled)
RUN corepack enable || true

# Copy only manifest files first for better Docker layer caching
COPY package.json yarn.lock ./
COPY apps/server/package.json ./apps/server/package.json
COPY apps/web/package.json ./apps/web/package.json

# Install deps for the whole monorepo (root run yarn)
RUN yarn install --frozen-lockfile

# Copy the rest of the monorepo
COPY . .

# Generate Prisma client in server workspace (apps/server run yarn prisma:generate)
RUN yarn workspace @edusama/server prisma:generate

# Build the web client (apps/web run yarn build)
RUN yarn workspace @edusama/web build


# Runtime stage: serve static files with Nginx
FROM nginx:1.27-alpine AS runtime

# Copy custom nginx config for SPA routing
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from builder
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


