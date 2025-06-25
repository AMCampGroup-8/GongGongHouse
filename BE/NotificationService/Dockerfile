# 베이스 이미지 (자바 17 런타임)
FROM amazoncorretto:17

# 메타 정보 (원하는 이름/이메일로 변경 가능)
LABEL maintainer="AMCAMP_MP2_GRP8"

# 컨테이너에서 사용할 작업 디렉토리
WORKDIR /app

# jar 파일 복사 (Gradle 빌드 후 생성되는 jar)
COPY build/libs/*.jar app.jar

# 컨테이너가 열어줄 포트 (application.yml에 설정한 포트와 맞춰야 함)
EXPOSE 8086

# 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]