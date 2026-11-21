# ==============================================================================
# Production Dockerfile for DevOpsForge
# ==============================================================================
FROM node:20-alpine

# Metadata labels (OCI Standard)
LABEL maintainer="DevOps Student <student@example.com>"
LABEL version="1.0.0"
LABEL description="DevOpsForge Production Cloud-Native Container"

WORKDIR /app

# Run as non-root user for container security
USER node

# Copy application files with proper permissions
COPY --chown=node:node package*.json ./
COPY --chown=node:node server.js ./
COPY --chown=node:node public ./public

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV APP_VERSION=1.0.0

# Expose internal container port
EXPOSE 3000

# Container Healthcheck (Docker Engine native)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health/live || exit 1

# Start application
CMD ["node", "server.js"]
