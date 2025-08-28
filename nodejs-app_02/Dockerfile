FROM node:alpine
WORKDIR /app

COPY . .
RUN npm install 
RUN npm install --save mysql2 morgan fs express

ENTRYPOINT [ "node", "app.js" ]