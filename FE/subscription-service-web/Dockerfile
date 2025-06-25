# 1단계: 빌드용
FROM node:20 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2단계: nginx로 서빙
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
