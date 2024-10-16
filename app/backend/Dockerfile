# Dockerfile for the backend service
FROM eclipse-temurin:21-jre

RUN mkdir -p /opt/application
COPY build/*-runner.jar /opt/application/backend.jar
CMD [ "java", "-jar", "backend.jar" ]
WORKDIR /opt/application
