

# Задача - НА ПРОВЕРКУ НЕСМОТРИМ!! возможны неточности
Проверка бд
```
docker exec -it mariadb-container mariadb -u root -p mybd
```

# CMDB API Server
Простое REST API для сервиса инвентаризацци серверов (CMDB - Configuration Management Database). Позволяет добавлять и просматривать информацию о серверах в базе данных MySQL.

## Требования
1) Node.js не ниже 14
2) MySQL (mariadb)
3) Nginx в роли reverse proxy

## Запуск приложения
```bash
npm install
node app.js
```
## Проверка
```bash
curl -X GET http://localhost:3000/assets?type=server
# или
curl -X GET http://localhost:3000/assets
```
Пример ответа (после первого запуска)
```
[]
```
```bash
curl -X POST -H "Content-Type: application/json" -d @cmdb-data.json  http://localhost:3000/asset
```
Пример ответа
```json
{
  "id": 1
}
```
Теперь при запросе
```bash
curl -X GET http://localhost:3000/assets
```
ответ примерно такой
```json
[
  {
    "id": 1,
    "hostname": "server1",
    "ip_address": "192.168.1.10",
    "role": "web server",
    "created_at": "2023-01-01T12:00:00.000Z"
  }
]
```
# Реализация

https://github.com/TapAleksej/Docker-compose/tree/main/nodejs-app_02

#### nginx.conf слушает на 3000 порту
```
upstream backend {
  server app:3000;
}

server {
    listen 80;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

}
```
#### Dockerfile

```dockerfile
FROM node:alpine3.20
WORKDIR /app
COPY . .
RUN npm install --save mysql2 morgan fs express

ENTRYPOINT [ "node", "app.js" ]
```

#### .env
```bash
DB_USER=olred
DB_PASSWORD=user_password
DB_NAME=mybd
DB_HOST=mariadb
MARIADB_ROOT_PASSWORD=root_password
MARIADB_DATABASE=mybd
MARIADB_USER=olred
MARIADB_PASSWORD=user_password
```
#### compose.yml
```yml
services:
  mariadb:
    image: mariadb:10.9
    container_name: mariadb-container
    environment:
      MARIADB_ROOT_PASSWORD: root_password
      MARIADB_DATABASE: mybd
      MARIADB_USER: olred
      MARIADB_PASSWORD: user_password
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "olred", "-puser_password"]
      interval: 30s
      timeout: 10s
      retries: 5

    volumes:
      - mariadb_data:/var/lib/mysql
    #ports:
    #  - 3306:3306
    restart: always

  nginx:
    container_name: proxy_nginx
    depends_on:
      - app
    image: nginx:latest
    # ports:
    #  - 8080:80
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    restart: always

  app:
      build:
        context: .
        dockerfile: Dockerfile
      env_file:
        - ./.env
      depends_on:
        mariadb:
          condition: service_healthy
      restart: always
      ports:
        - 3000:3000

volumes:
  mariadb_data:
```



## Проверка

```
curl -X GET http://localhost:3000/api/servers

nodejs-app_02# curl -X GET http://localhost:3000/api/servers
[]
```

```bash
curl -X POST -H "Content-Type: application/json" -d @cmdb-data.json  http://localhost:3000/api/serversrs
{"error":"Column 'hostname' cannot be null"}
```

Вставка hostname, ip_address, role из cmdb-data.json

```js
app.post('/api/servers', async (req, res) => {
  const { hostname, ip_address, role } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO servers (hostname, ip_address, role) VALUES (?, ?, ?)',
      [hostname, ip_address, role]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

cmdb-data.json
```js
{
    "type": "server",
    "name": "Web Server 01",
    "model": "HP ProLiant DL380",
    "serialNumber": "HP987654",
    "location": "Rack 15",
    "owner": "Web Team",
    "attributes": {
      "cpu": "2x Intel Xeon Silver 4210",
      "ram": "128GB",
      "storage": "2x 1TB SSD"
    }
  }
```
меняю на
```js
{
    "hostname": "server",
    "ip_address": "127.0.0.1",
    "role":"admin"
}

```

На выходе
```bash
curl -X POST -H "Content-Type: application/json" -d @cmdb-data.json  http://localhost:3000/api/servers
{"id":1}

 curl -X GET http://localhost:3000/api/servers
[{"id":1,"hostname":"server","ip_address":"127.0.0.1","role":"admin","created_at":"2025-08-29T16:26:40.000Z"}]
```