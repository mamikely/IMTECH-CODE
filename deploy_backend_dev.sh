#!/bin/bash

# 1. Build du backend
cd ~/IMTECH/CODE/backend/gestionecole
mvn clean package

# 2. Copier le .jar
cp target/*.jar ~/IMTECH/CODE/backend/gestionecole.jar

# 3. Aller dans APP_DEV
cd ~/IMTECH/APP_DEV

# 4. Restart container
docker stop spring-app-dev || true
docker rm spring-app-dev || true

docker run -d \
  --name spring-app-dev \
  -v ~/IMTECH/CODE/backend/gestionecole.jar:/app/gestionecole.jar \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql9:3306/app?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=rootpassword \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO=update \
  -p 8081:8080 \
  eclipse-temurin:17-jdk \
  java -jar /app/gestionecole.jar