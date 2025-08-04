# Base image
FROM node:22-alpine as production

# Create app directory
WORKDIR /app

COPY apps/server/package.json ./apps/server/package.json
COPY packages/common/package.json ./packages/common/package.json
COPY packages/eslint-config-custom/package.json ./packages/eslint-config-custom/package.json
COPY packages/prettier/package.json ./packages/prettier/package.json


# Copy the root yarn.lock for version resolution by using volumes
COPY yarn.lock ./
COPY package.json ./


# Install only API dependencies
RUN yarn install --frozen-lockfile

# Bundle app source
COPY ./apps/server ./apps/server
COPY ./packages ./packages

# go into apps/server
WORKDIR /app/apps/server

RUN yarn prisma generate

# Build the application
RUN yarn workspace @edusama/common build
RUN yarn build

# Expose application port
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]
# CMD ["tail", "-f", "/dev/null"]