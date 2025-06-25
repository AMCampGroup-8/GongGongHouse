# 1단계: 빌드
FROM gradle:8.7.0-jdk17 AS build
WORKDIR /app
COPY --chown=gradle:gradle . .
RUN gradle build -x test

# 2단계: 실행
FROM openjdk:17-jdk-alpine
WORKDIR /app

# 설정 파일 복사
COPY --from=build /app/src/main/resources /app/resources

# JAR 복사
ARG JAR_FILE=build/libs/*.jar
COPY --from=build /app/${JAR_FILE} app.jar

# 🔥 Spring에게 설정파일 경로 알려줌!
ENV SPRING_CONFIG_LOCATION=file:/app/resources/

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

CMD ["java", "-jar", "app.jar", "--spring.profiles.active=dev"]

