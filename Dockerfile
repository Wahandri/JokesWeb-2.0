# Backend
FROM node:16

WORKDIR /app

# Instalar dependencias del backend
COPY ./backEnd/package*.json ./
RUN npm install

# Copiar el código del backend
COPY ./backEnd .

# Copiar el frontend antes de cambiar de directorio
COPY ./frontEnd ./client

# Construir el frontend
WORKDIR /app/client
RUN npm install && npm run build

# Volver al backend y correr el servidor
WORKDIR /app
CMD ["npm", "start"]
