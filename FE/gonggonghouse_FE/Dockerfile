# 🧱 1단계: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src

RUN npm install
RUN npm run build

# 🚀 2단계: Serve with nginx
FROM nginx:stable-alpine

# 빌드된 결과물을 nginx 디렉터리로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx 기본 포트
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]