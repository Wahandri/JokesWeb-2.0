# Backend
FROM node:16

WORKDIR /app

# Instalar dependencias del backend
COPY ./backEnd/package*.json ./
RUN npm install

# Copiar el código del backend
COPY ./backEnd .

# Servir frontend con el backend
WORKDIR /app/client
COPY ./frontEnd/package*.json ./
RUN npm install && npm run build

# Volver al backend y correr el servidor
WORKDIR /app
CMD ["npm", "start"]
