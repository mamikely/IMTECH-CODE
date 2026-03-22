#!/bin/bash
echo "==== Déploiement Frontend DEV ===="

# Aller dans le dossier APP_DEV
cd ~/IMTECH/APP_DEV

# Redémarrer seulement le conteneur frontend
docker-compose up -d --no-deps --build nginx

echo "==== Frontend DEV redémarré ===="