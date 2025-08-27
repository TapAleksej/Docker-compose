FROM node:16.10.0-alpine
# RUN apk add --no-cache tzdata
# ENV TZ Europe/Moscow
# ENV NODE_PATH /opt/server/node_modules

WORKDIR /app

COPY . .
RUN npm install

ENTRYPOINT ["sh", "-c", "npm run start"]