FROM openjdk:8
VOLUME /tmp
ADD mes-1.0.0.jar /app.jar

EXPOSE 9080

ENV MYSQL_HOST=127.0.0.1
ENV MYSQL_PORT=3306
ENV MYSQL_USER=admin
ENV MYSQL_PASSWD=123456
ENV REDIS_HOST=127.0.0.1
ENV REDIS_PORT=127.0.0.1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app.jar"]