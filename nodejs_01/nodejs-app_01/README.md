# Express Memcached Demo
Приложение предоставляет API endpoint, который записывает данные в Memcached и сразу же читает их обратно, демонстрируя работу с кэшированием. Каждый запрос сохраняет текущую метку времени в кэше и возвращает ее в ответе.

## Требования
1) Node.js не ниже 12
2) Memcached сервер
3) Nginx в роли reverse proxy

## Запуск приложения
```bash
npm install
npm start
```
## Проверка
```bash
curl http://localhost:3000
```
Пример ответа
```json
{
  "message": "Данные успешно записаны и прочитаны из Memcached!",
  "cached": {
    "timestamp": 1640995200000
  },
  "status": "success"
}
```
