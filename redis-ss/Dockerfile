FROM redis:7.0.9-bullseye

COPY redis.conf /usr/local/etc/redis/redis.conf
COPY ./tests/tls/redis.crt /usr/local/etc/redis/redis.crt
COPY ./tests/tls/redis.key /usr/local/etc/redis/redis.key
COPY ./tests/tls/ca.crt /usr/local/etc/redis/ca.crt

RUN chown -R redis:redis /usr/local/etc/redis
COPY ./az-tls/ca.crt /usr/local/share/ca-certificates/custom-ca.crt

USER root
RUN update-ca-certificates

USER redis

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]