# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Ahora copiamos desde la raíz del contexto (que es Frontend/)
COPY package*.json ./
RUN npm ci

COPY . ./                

RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Tu configuración nginx (la copias tal cual)
RUN mkdir -p /etc/nginx/conf.d
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copia la build (Vite deja la salida en dist/ por defecto)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]