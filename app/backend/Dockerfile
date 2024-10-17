FROM eclipse-temurin:21-jre

RUN mkdir -p /opt/application
COPY build/*-runner.jar /opt/application/backend.jar
RUN id
CMD ["sh", "-c", "echo '\n10.191.112.13\tauth.htl-leonding.ac.at\n' >> /etc/hosts && java -jar backend.jar"]
WORKDIR /opt/application
