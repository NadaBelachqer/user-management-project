FROM node:18-alpine

WORKDIR /app

# Copiez d'abord les fichiers de configuration
COPY package*.json ./

# Installez toutes les dépendances (production + développement)
RUN npm install dotenv express mysql2 --save
RUN npm install --only=production

# Copiez le reste de l'application
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]