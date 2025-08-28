FROM node:alpine
WORKDIR /app
COPY . .
RUN npm install

ENTRYPOINT ["sh", "-c", "npm run start"]
