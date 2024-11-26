# Usa una imagen oficial de Node.js como base
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Instalar curl y las dependencias del proyecto
RUN apt-get update && apt-get install -y curl

# Copiar el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install --production

# Copiar el resto del código de la aplicación al contenedor
COPY . .

# Exponer el puerto en el que corre la app
EXPOSE 3006

# Usar las variables de entorno desde el archivo .env
# En un entorno de producción, puedes pasar variables de entorno a través del CLI en lugar de esto.
# Aquí lo dejamos listo para que lo pases externamente en el run del contenedor
CMD ["npm", "start"]
