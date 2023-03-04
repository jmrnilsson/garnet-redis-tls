#!/bin/bash

# https://learn.microsoft.com/en-us/azure/application-gateway/self-signed-certificates
# https://www.baeldung.com/openssl-self-signed-cert
# https://acloudguru.com/hands-on-labs/creating-a-certificate-authority-and-tls-certificates-for-kubernetes
# https://smallstep.com/blog/automate-docker-ssl-tls-certificates/
mkdir -p az-tls
pass=$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w ${1:-20} | head -n 1)

cat > az-tls/ca.ini <<_END_
[ req ]
prompt = no
default_bits = 4096
distinguished_name = req_distinguished_name
req_extensions = req_ext

[ req_distinguished_name ]
countryName             = SE
stateOrProvinceName     = Stockholm
localityName            = Stockholm
organizationName        = Private
organizationalUnitName  = None

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = local-ca-master
_END_

cat > az-tls/openssl.ini <<_END_
[ req ]
prompt = no
default_bits = 4096
distinguished_name = req_distinguished_name
req_extensions = req_ext

[ req_distinguished_name ]
countryName             = SE
stateOrProvinceName     = Stockholm
localityName            = Stockholm
organizationName        = Private
organizationalUnitName  = None

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
_END_

openssl ecparam -out ./az-tls/ca.key -name prime256v1 -genkey
openssl req -new -sha256 -key ./az-tls/ca.key -out ./az-tls/ca.csr -config ./az-tls/ca.ini -passin pass:$pass
openssl x509 -req -sha256 -days 365 -in ./az-tls/ca.csr -signkey ./az-tls/ca.key -out ./az-tls/ca.crt

# openssl genrsa -out ./az-tls/ca.key 4096
openssl ecparam -out ./az-tls/redis.key -name prime256v1 -genkey
openssl req -new -sha256 -key ./az-tls/redis.key -out ./az-tls/redis.csr -config ./az-tls/openssl.ini
openssl x509 -req -in ./az-tls/redis.csr -out ./az-tls/redis.crt -days 365 -sha256 -CAkey ./az-tls/ca.key -CA ./az-tls/ca.crt
# openssl x509 -req -in ./az-tls/redis.csr -out ./az-tls/redis.crt -days 365 -sha256 -key ./az-tls/redis.key
openssl x509 -in ./az-tls/redis.crt -text -noout

echo "password is $pass"