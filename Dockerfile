# Usar Node.js 18 LTS como imagen base
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY src/ ./src/
COPY tsconfig.json ./

# Skip TypeScript compilation - run with tsx directly

# Instalar Python y uv para uvx
RUN apk add --no-cache python3 py3-pip curl && \
    curl -LsSf https://astral.sh/uv/install.sh | sh && \
    mv /root/.local/bin/uv /usr/local/bin/ && \
    mv /root/.local/bin/uvx /usr/local/bin/

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S komodo -u 1001

# Cambiar ownership de archivos
RUN chown -R komodo:nodejs /app
USER komodo

# Expose port for API
EXPOSE 9716

# Default environment variables
ENV NODE_ENV=production \
    PORT=9716 \
    KOMODO_URL="" \
    KOMODO_KEY="" \
    KOMODO_SECRET="" \
    KOMODO_API_KEY=""

# Default command - run consolidated server with tsx (no build needed)
CMD ["npx", "tsx", "/app/src/server-consolidated.ts"]
