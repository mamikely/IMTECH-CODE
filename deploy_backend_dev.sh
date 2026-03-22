#!/bin/bash
cd ~/IMTECH/APP_DEV

# Arrêter le container existant si nécessaire
docker stop spring-app-dev || true
docker rm spring-app-dev || true

# Relancer le backend avec le .jar depuis CODE/backend
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