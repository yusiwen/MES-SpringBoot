#!/bin/bash

docker run --rm -d \
  --name mes \
  -p 9098:9080 \
  -e MYSQL_HOST=localhost \
  -e MYSQL_PORT=3306 \
  -e MYSQL_USER=admin \
  -e MYSQL_PASSWD=123456 \
  -e REDIS_HOST=localhost \
  -e REDIS_PORT=6379 \
  mes-demo:latest