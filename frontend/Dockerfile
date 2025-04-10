# Étape 1 : build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : serve via nginx
FROM nginx:alpine

# Copie le fichier de config nginx personnalisé
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie le build React dans le dossier HTML de nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

