# CMDB API Server
Простое REST API для сервиса инвентаризацци серверов 
(CMDB - Configuration Management Database). 
Позволяет добавлять и просматривать информацию о серверах в базе данных MySQL.

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
