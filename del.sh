#!/usr/bin/env bash

docker ps -qa | xargs docker rm -f
docker images -qa | xargs docker rmi -f
echo docker volume rm $(docker volume ls -q)

docker ps -a
docker images
docker volume ls

docker compose up -d --build
