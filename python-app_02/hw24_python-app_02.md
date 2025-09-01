### Задача

#### AutoShop Cars API
Простое RESTful API приложение для управления базой данных автомобилей.
Позволяет выполнять основные CRUD операции (создание, чтение, обновление, удаление)
записей об автомобилях в MongoDB.

#### Требования
1) python 3
2) mongodb

#### Запуск приложения
```bash
python3 app.py
```

#### Проверка
```bash
# Добавить автомобиль
curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Camry",
    "year": 2022,
    "price": 25000
  }'
```


пример ответа
```json
{"id":"507f1f77bcf86cd799439011"}
```

```bash
# получить список всех авто
curl -X GET http://localhost:5000/api/cars
```

```bash
# удалить авто (заменить CAR_ID на реальный id)
curl -X DELETE http://localhost:5000/api/cars/CAR_ID
```

## Реализация
Нужно прописать переменную для подключения app к mongo
`MONGO_URI: 'mongodb://root:example@mongodb:27017/cars?authSource=admin'`
, а так же переменные для инициализации mongo:
```
MONGO_INITDB_ROOT_USERNAME: root
MONGO_INITDB_ROOT_PASSWORD: example
MONGO_INITDB_DATABASE: cars
```
Для mongo прописан healthcheck c сервисом mongodb:
```yml
healthcheck:
      test: "echo 'db.runCommand({ serverStatus: 1 }).ok' | mongosh --authenticationDatabase admin --host \
            mongodb -u root -p example --quiet | grep -q 1"
      interval: 10s
      timeout: 10s
      retries: 3
```

Остальное стандартно.


#### nginx.conf
```bash
upstream backend {
  server app:5000;
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
FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python3", "./app.py" ]
```

#### compose.yml
```yml
services:
  mongodb:
    image: mongo:8
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: cars
    ports:
      - 27017:27017
    volumes:
      - mongo_data:/data/db
      #- ./init-car.js:/docker-entrypoint-initdb.d/init-mongo.js
    healthcheck:
      test: "echo 'db.runCommand({ serverStatus: 1 }).ok' | mongosh --authenticationDatabase admin --host \
            mongodb -u root -p example --quiet | grep -q 1"
      interval: 10s
      timeout: 10s
      retries: 3

  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      MONGO_URI: 'mongodb://root:example@mongodb:27017/cars?authSource=admin'
    depends_on:
      mongodb:
        condition: service_healthy
    restart: always
    ports:
      - 5000:5000

  nginx:
    container_name: proxy_nginx
    depends_on:
      - app
    image: nginx:latest
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    restart: always

volumes:
  mongo_data:
```

### Проверка

#### Вставка строки
```bash
curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Camry",
    "year": 2022,
    "price": 25000
  }'
{"id": "68b51bfbf499b63b2d87c4da"}
```
#### Список авто
```bash
curl -X GET http://localhost:5000/api/cars
[{"_id": {"$oid": "68b51bfbf499b63b2d87c4da"}, "brand": "Toyota", "model": "Camry", "year": 2022, "price": 25000}]
```

#### Удалить авто
```bash
curl -X DELETE http://localhost:5000/api/cars/68b51bfbf499b63b2d87c4da
{"message": "Car deleted"}
```
