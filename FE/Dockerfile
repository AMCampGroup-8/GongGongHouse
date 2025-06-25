# 빌드 스테이지
FROM node:20 as build

WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install
RUN npm install @rollup/rollup-linux-x64-gnu --no-save
RUN npm install esbuild@0.25.4 --save-exact

# 소스 코드 복사
COPY . .

# esbuild 바이너리 문제 해결
RUN cd node_modules/esbuild && npm run postinstall

# 환경 변수 설정
ENV NODE_ENV=production

# 빌드 및 환경 변수 주입
RUN npm run build

# 실행 스테이지
FROM nginx:stable

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 nginx로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 권한 설정
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]