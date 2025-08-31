# Задача

# AutoShop Cars API
Простое RESTful API приложение для управления базой данных автомобилей.
Позволяет выполнять основные CRUD операции (создание, чтение, обновление, удаление)
записей об автомобилях в MongoDB.

## Требования
1) python 3
2) mongodb

## Запуск приложения
```bash
python3 app.py
```

## Проверка
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

# Реализация

Судя по зависимостям в app.py, в файле requirements.txt нехватает `bson` - добавлен.

.env
```
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=example
```


docker exec -it d74ade7d23eb mariadb -u root -p mybd

docker exec -it 5e1e781f2c53  mongosh --host localhost --username root --password example


show dbs
use car
show collections
db.data.find()


root@ubuntu1:/home/alrex/PRO/compose/Docker-compose/python-app_02# curl -X POST http://localhost:5000/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Camry",
    "year": 2022,
    "price": 25000
  }'
{"id": "68b4956e30ccff926bc8c445"}root@ubuntu1:/home/alrex/PRO/compose/Docker-compose/python-app_02# curl -X GET http://localhost:5000/api/cars
[{"_id": {"$oid": "68b4956e30ccff926bc8c445"}, "brand": "Toyota", "model": "Camry", "year": 2022, "price": 25000root@ubuntu1:/home/alrex/PRO/compose/Docker-compose/python-app_02# curl -X DELETE http://localhost:5000/api/cars/CAR_IDID
<!doctype html>
<html lang=en>
<title>500 Internal Server Error</title>
<h1>Internal Server Error</h1>
<p>The server encountered an internal error and was unable to complete your request. Either the server is overloaded or there is an error in the application.</p>
root@ubuntu1:/home/alrex/PRO/compose/Docker-compose/python-app_02# curl -X DELETE http://localhost:5000/api/cars/1
<!doctype html>
<html lang=en>
<title>500 Internal Server Error</title>
<h1>Internal Server Error</h1>
<p>The server encountered an internal error and was unable to complete your request. Either the server is overloaded or there is an error in the application.</p>
root@ubuntu1:/home/alrex/PRO/compose/Docker-compose/python-app_02# curl -X DELETE http://localhost:5000/api/cars/68b4956e30ccff926bc8c445
{"message": "Car deleted"}root@ubuntu1:/home/alrex/PRO/compose/Docker-compose/python-app_02#
