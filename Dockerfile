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

# Compilar TypeScript
RUN pnpm run build

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S komodo -u 1001

# Cambiar ownership de archivos
RUN chown -R komodo:nodejs /app
USER komodo

# Exponer puerto para supergateway
EXPOSE 3333

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV KOMODO_URL=""
ENV KOMODO_KEY=""
ENV KOMODO_SECRET=""

# Comando por defecto - usar supergateway para HTTP/SSE
CMD ["npx", "-y", "supergateway", "--stdio", "node /app/dist/index.js", "--port", "3333", "--baseUrl", "http://0.0.0.0:3333", "--ssePath", "/sse", "--messagePath", "/message", "--cors"]