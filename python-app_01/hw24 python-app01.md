## Задача
### Hit Counter
Приложение отображает сообщение "Hello World!" и счетчик, который увеличивается при каждом посещении главной страницы. Данные о количестве посещений хранятся в Redis.

### Запуск приложения
1) Убедитесь что у вас есть redis
2) Убедитесь, что задали переменную REDIS_HOST
3) Запустите приложение `python3 app.py`

### Проверка
```curl 127.0.0.1:500'
```
Пример ответа
```
Hello World! I have been seen 42 times.
```

## Реализация

#### compose.yml

```yml
services:
  redis:
    image: redis:8.2-alpine
    container_name: redis_bd
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    env_file:
      - ./.env
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "$REDIS_PASSWORD", "ping"]
      interval: 30s
      timeout: 10s
      retries: 5

  nginx:
    container_name: proxy_nginx
    depends_on:
      - app
    image: nginx:latest
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
        redis:
          condition: service_healthy
      restart: always
      ports:
        - 5000:5000



volumes:
  redis_data:
```

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
#### .env

```bash
REDIS_HOST=redis
REDIS_PASSWORD=my_redis_password
REDIS_USER=my_user
REDIS_USER_PASSWORD=my_user_password
```

### Проверка
```bash
 curl 127.0.0.1:5000
Hello World! I have been seen 1 times.
 curl 127.0.0.1:5000
Hello World! I have been seen 2 times.
```