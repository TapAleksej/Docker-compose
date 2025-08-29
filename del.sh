#!/usr/bin/env bash

docker ps -qa | xargs docker rm -f
docker images -qa | xargs docker rmi -f

docker ps -a
docker images

olumes=$(docker volume ls -q)

if [ -z "$volumes" ]; then
  echo "No volumes found to remove"
  exit 0
fi

# Выводим предупреждение
echo "WARNING: This will delete ALL Docker volumes:"
echo "$volumes"
read -p "Are you sure you want to continue? (y/n) " -n 1 -r
echo    # move to a new line

if [[ $REPLY =~ ^[Yy]$ ]]
then
  # Удаляем все volumes
  docker volume rm $(docker volume ls -q)
  echo "All volumes removed"
else
  echo "Operation cancelled"
fi