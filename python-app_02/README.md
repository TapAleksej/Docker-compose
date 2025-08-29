# AutoShop Cars API
Простое RESTful API приложение для управления базой данных автомобилей. Позволяет выполнять основные CRUD операции (создание, чтение, обновление, удаление) записей об автомобилях в MongoDB.

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
