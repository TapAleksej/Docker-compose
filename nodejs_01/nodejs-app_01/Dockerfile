FROM node:alpine
# RUN apk add --no-cache tzdata
# ENV TZ Europe/Moscow
# ENV NODE_PATH /opt/server/node_modules

WORKDIR /opt/server/

COPY . .
RUN npm install

ENTRYPOINT ["sh", "-c", "npm run start"]
