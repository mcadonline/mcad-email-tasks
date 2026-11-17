FROM node:24-bookworm-slim AS base

WORKDIR /app
# Fail the build if the base image predates the Brotli security fix.
RUN node -e "const [major, minor, patch] = process.versions.node.split('.').map(Number); if (major !== 24 || minor < 22 || (minor === 22 && patch < 1)) process.exit(1)"
COPY package.json package-lock.json ./

FROM base AS development
RUN npm ci --no-audit --no-fund
COPY --chown=node:node . .
RUN mkdir -p tmp && chown node:node tmp
USER node
CMD ["node", "cli.js", "--help"]

FROM base AS production
RUN npm ci --omit=dev --no-audit --no-fund
COPY --chown=node:node . .
RUN mkdir -p tmp && chown node:node tmp
USER node
ENTRYPOINT ["node", "cli.js"]
CMD ["--help"]
