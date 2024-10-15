# Stage 1: Build Quarkus application using Gradle
FROM gradle:7.5.1-jdk17 AS build
WORKDIR /app

# Copy build files and source code
COPY build.gradle.kts settings.gradle.kts gradlew* ./
COPY gradle ./gradle
COPY src ./src

# Build the application
RUN ./gradlew build --no-daemon -x test

# Stage 2: Create the final image with the built application
FROM eclipse-temurin:17-jre
WORKDIR /opt/application

# Copy the built jar from the build stage
COPY --from=build /app/build/libs/*-runner.jar /opt/application/backend.jar

# Run the application
CMD ["java", "-jar", "backend.jar"]