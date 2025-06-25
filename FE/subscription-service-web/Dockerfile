# 1단계: Node 환경에서 React 앱 빌드
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
