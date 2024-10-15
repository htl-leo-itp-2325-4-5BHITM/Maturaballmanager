# Stage 1: Build Angular App
FROM node:22-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration production

# Stage 2: NGINX Serve
FROM nginx:alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
