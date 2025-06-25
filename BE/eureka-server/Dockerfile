FROM openjdk:17-jdk AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN microdnf update -y && microdnf install -y findutils
RUN ./gradlew clean build -x test

FROM openjdk:17-jdk
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"] 