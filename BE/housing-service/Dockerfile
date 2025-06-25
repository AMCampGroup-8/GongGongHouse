# 1. Java 17 기반 이미지 사용
FROM eclipse-temurin:17-jdk

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 빌드된 JAR 파일을 컨테이너에 복사
COPY build/libs/housing-service-0.0.1-SNAPSHOT.jar app.jar

# 4. JAR 실행
ENTRYPOINT ["java", "-jar", "app.jar"]
