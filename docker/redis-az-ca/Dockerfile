FROM redis:7.0.9-alpine

COPY redis.conf /usr/local/etc/redis/redis.conf
COPY ./az-tls/redis.crt /usr/local/etc/redis/redis.crt
COPY ./az-tls/redis.key /usr/local/etc/redis/redis.key
COPY ./az-tls/ca.crt /usr/local/etc/redis/ca.crt

RUN chown -R redis:redis /usr/local/etc/redis
COPY ./az-tls/ca.crt /usr/local/share/ca-certificates/custom-ca.crt
RUN cat /usr/local/share/ca-certificates/custom-ca.crt >> /etc/ssl/certs/ca-certificates.crt

USER root
RUN apk --no-cache add ca-certificates
RUN /usr/sbin/update-ca-certificates
USER redis

CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]