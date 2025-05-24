# Étape 1 : Image de base officielle Node.js
FROM node:18

# Étape 2 : Définir le dossier de travail dans le container
WORKDIR /usr/src/app

# Étape 3 : Copier les fichiers de dépendances (npm)
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier tous les fichiers du projet dans le container
COPY . .

# Étape 6 : Exposer le port que ton backend utilise (3100 d’après ce que tu avais mentionné)
EXPOSE 3100

# Étape 7 : Lancer le serveur
CMD ["npm", "start"]
