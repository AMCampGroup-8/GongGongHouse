FROM amazoncorretto:17
LABEL maintainer="AMCAMP_MP2_GRP8"
VOLUME /tmp
EXPOSE 8080
COPY build/libs/*.jar /app.jar
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app.jar"]