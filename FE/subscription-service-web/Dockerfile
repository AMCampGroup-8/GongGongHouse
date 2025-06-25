# 1단계: 빌드용
FROM node:20 AS builder

WORKDIR /app

# ✅ 환경변수 적용을 위해 .env 파일 복사!
COPY .env .env

# ✅ 다른 파일들과 함께 복사 (기존 코드 그대로 유지)
COPY . .

RUN npm install
RUN npm run build

# 2단계: nginx로 서빙
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
