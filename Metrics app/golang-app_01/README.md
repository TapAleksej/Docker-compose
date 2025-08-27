# Metrics app
Веб-приложение на Go, которое предоставляет API эндпоинты, собирает метрики в формате Prometheus и сохраняет логи запросов в PostgreSQL.
## Требования
1) Golang 1.24.4
2) Postgresql

## Запуск приложения
Перед запуском приложения должна быть инициализирована БД:
```bash
CREATE USER goappuser WITH PASSWORD 'qwer/.,m';
CREATE DATABASE goapp OWNER goappuser;
```

## Проверка
```bash
# генерируем нагрузку
curl "http://localhost:5000/generate-load?n=5000000"
# проверяем данные приложения
curl http://localhost:5000/metrics
curl http://localhost:5000/error
curl http://localhost:5000
```
