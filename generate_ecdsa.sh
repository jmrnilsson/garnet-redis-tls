#!/bin/bash
set -e

generate_cert() {
    local name=$1
    local cn="$2"
    local opts="$3"

    local keyfile=tls-ecdsa/tls/${name}.key
    local certfile=tls-ecdsa/tls/${name}.crt

    [ -f $keyfile ] || openssl ecparam -out $keyfile -name prime256v1 -genkey
    openssl req \
        -new -sha256 \
        -subj "/O=Redis Verification/CN=$cn" \
        -key $keyfile | \
        openssl x509 \
            -req -sha256 \
            -CA tls-ecdsa/tls/ca.crt \
            -CAkey tls-ecdsa/tls/ca.key \
            -CAserial tls-ecdsa/tls/ca.txt \
            -CAcreateserial \
            -days 365 \
            $opts \
            -out $certfile
}

rm -rf ./tls-ecdsa
mkdir -p tls-ecdsa/tls

cat > tls-ecdsa/redis.conf <<_END_
tls-cert-file /tls/redis.crt
tls-key-file /tls/redis.key
tls-ca-cert-file /tls/ca.crt
port 0
tls-port 6379
tls-auth-clients no
_END_


[ -f tls-ecdsa/tls/ca.key ] || openssl ecparam -out tls-ecdsa/tls/ca.key -name prime256v1 -genkey
openssl req \
    -x509 -new -nodes -sha256 \
    -key tls-ecdsa/tls/ca.key \
    -days 3650 \
    -subj '/O=Redis Verification/CN=Certificate Authority' \
    -out tls-ecdsa/tls/ca.crt

generate_cert redis "localhost"

[ -f tls-ecdsa/tls/redis.dh ] || openssl dhparam -out tls-ecdsa/tls/redis.dh 2048
