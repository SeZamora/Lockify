FROM node:23-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json .

# Ejecutar npm install para instalar las dependencias
RUN npm install

# Instala nodemon global para recargar el servidor automáticamente
RUN npm install -g nodemon

# Copiar el resto del codigo
COPY . .

EXPOSE 3000

CMD [ "node", "src/main.js" ]

