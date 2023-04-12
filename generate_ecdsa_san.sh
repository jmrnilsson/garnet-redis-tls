#!/bin/bash
set -e
pem_password=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w ${1:-1028} | head -n 1)

generate_cert() {
    local name=$1
    local cn="$2"
    local opts="$3"

    local keyfile=tls-ecdsa-san/tls/${name}.key
    local certfile=tls-ecdsa-san/tls/${name}.crt
    local signreq=tls-ecdsa-san/tls/${name}.csr

    echo "Certificate prime key"
    [ -f $keyfile ] || openssl ecparam -out $keyfile -name prime256v1 -genkey
    echo "Certificate SAN request"
    openssl req -new -sha256 -key $keyfile -out $signreq -config ./tls-ecdsa-san/openssl.ini
    echo "Sign with CA"
    # openssl x509 -req -in $signreq -out ./az-tls/redis.crt -days 365 -sha256 -CAkey ./az-tls/ca.key -CA ./az-tls/ca.crt
    openssl x509 \
        -req \
        -in $signreq \
        -sha256 \
        -CA tls-ecdsa-san/tls/ca.crt \
        -CAkey tls-ecdsa-san/tls/ca.key \
        -CAserial tls-ecdsa-san/tls/ca.txt \
        -CAcreateserial \
        -days 365 \
        -out $certfile
        # $opts \
    
    echo "Done with certificate generation"
    # openssl x509 -req -in ./az-tls/redis.csr -out ./az-tls/redis.crt -days 365 -sha256 -CAkey ./az-tls/ca.key -CA ./az-tls/ca.crt
    # openssl req \
    #     -new -sha256 \
    #     -passin pass:$pem_password
    #     # -subj "/O=Redis Verification/CN=$cn" \
    #     -config ./tls-ecdsa-san/openssl.ini
    #     -key $keyfile | \
    #     openssl x509 \
    #         -req -sha256 \
    #         -CA tls-ecdsa-san/tls/ca.crt \
    #         -CAkey tls-ecdsa-san/tls/ca.key \
    #         -CAserial tls-ecdsa-san/tls/ca.txt \
    #         -CAcreateserial \
    #         -days 365 \
    #         $opts \
    #         -out $certfile
}

rm -rf ./tls-ecdsa-san
mkdir -p tls-ecdsa-san/tls

cat > ./tls-ecdsa-san/redis.conf <<_END_
tls-cert-file /tls/redis.crt
tls-key-file /tls/redis.key
tls-ca-cert-file /tls/ca.crt
port 0
tls-port 6379
tls-auth-clients no
_END_

cat > ./tls-ecdsa-san/openssl.ini <<_END_
[ req ]
prompt = no
default_bits = 4096
distinguished_name = req_distinguished_name
req_extensions = req_ext

[ req_distinguished_name ]
CN                      = dont-use-this
countryName             = SE
stateOrProvinceName     = Stockholm
localityName            = Stockholm
organizationName        = Private
organizationalUnitName  = None
emailAddress            = None

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
# IP.1 = 127.0.0.1
# IP.2 = ::1
_END_

echo "Generate CA-key with prime"
[ -f tls-ecdsa-san/tls/ca.key ] || openssl ecparam -out tls-ecdsa-san/tls/ca.key -name prime256v1 -genkey

echo "Create CA certificate"
openssl req \
    -x509 -new -nodes -sha256 \
    -key tls-ecdsa-san/tls/ca.key \
    -days 3650 \
    -subj '/O=Redis Verification/CN=Certificate Authority' \
    -out tls-ecdsa-san/tls/ca.crt

echo "Generate certificates"
generate_cert redis "localhost"

[ -f tls-ecdsa-san/tls/redis.dh ] || openssl dhparam -out tls-ecdsa-san/tls/redis.dh 2048

echo "PEM Password generated as '$pem_password'"