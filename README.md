# A dive into Garnet and Redis support of TLS with self-signed certificates

## Description

A probe into self-signed certificate support for a few Redis clients: `ioredis`, `redis (node_redis)` and `redis (Python)`.
This is useful when Redis is used behind a firewall e.g. Kubernetes but without a service mesh, like
[Istio](https://istio.io/latest/about/service-mesh/) or [Linkerd](https://linkerd.io/), for mTLS.

## Background 

I don't know exactly what's going on here. But TLS support for redis doesn't appear to be a a priority. There is [this
post](http://antirez.com/news/96) from the author; then a [follow-up](http://antirez.com/news/118). There are some
pretty decent looking [performance measurements](https://github.com/redis/redis/issues/7595). There's the note about
lack of IO threading in [the official documentation](https://redis.io/docs/management/security/encryption/). And then 
some more ideas on connection pooling here (TBD). There is this [stale repo](https://github.com/josiahcarlson/redis-tls)
from where TLS probably reintegrated from once. And that team had a funny story that they aren't ready to be share yet.

Unfortunately, there are plenty invalid documentation floating around when it comes to client use. And there're troves
of unanswered questions asked in StackOverflow.com when it comes to redis and TLS. 

In conclusion, finding a client library that can run self-signed certificates reliably isn't exactly easy. I reckon 
Redis can be put as a sidecar with UNIX sockets. Another option, memcached, only has TLS as an
[experimental feature](https://github.com/memcached/memcached/wiki/TLS).

## Requirements

- Windows 10
- Python 3.10+
- Node v.18 LTS
- Powershell Core v.6+ (typically shipped with Windows 10+)
- WSL2

## Getting started

Open WSL terminal and run:

*Note:* Current dynamic binding to certificate generation is broken!

```zsh
sh ./setup.sh
```

## Running tests

This will run both Jasmine tests for redis (previously node_redis), ioredis and redis (Python). In PowerShell run:

```pwsh
.\tests.ps1
```

## Outcomes

### Used abbreviations

- **RSA**: Rivest–Shamir–Adleman algorithm (anno 1994) with Common Name.
- **ECDSA**: Elliptic Curve algorithm with Common Name.
- **AZCA**: Elliptic Curve algorithm with AltName scheme via Distinguished Name per Microsoft Api Gateway custom root CA example.

### Test runs

Based on integration tests. Still hoping things will improve with some tweaking of certificate generation.

| Client | Version | Signed per | Status |
|------|------|------|------|
| `redis (node_redis)` | 4.6.5 | RSA | ✅ OK |
| `redis (node_redis)` | 4.6.5 | ECDSA | ✅ OK |
| `redis (node_redis)` | 4.6.5 | AZCA  | ⛔  Self-sign failure (depth zero) |
| `ioredis` | 5.3.1 | RSA | ✅ OK |
| `ioredis` | 5.3.1 | ECDSA | ✅ OK |
| `ioredis` | 5.3.1 | AZCA   | ⛔ Self-sign failure |
| `redis (Python)` | 4.5.1 | RSA | ✅ OK |
| `redis (Python)` | 4.5.1 | ECDSA | ✅ OK |
| `redis (Python)` | 4.5.1 | AZCA | ⛔ Self-sign failure |

### Common error messages

- Hostname/IP does not match certificate's altnames: Host: localhost. is not cert's CN: Generic-cert
- 'Host: localhost. is not cert's CN: Generic-cert', host: 'localhost'.
- Certificate verify failed: self signed certificate (_ssl.c:1129).
- DEPTH_ZERO_SELF_SIGNED_CERT
- Error: self-signed certificate

## TL;DR

Out of the tested libraries it looks like `redis (Python)` verifies a self-signed certificate matching Common Name against DNS-record. `ioredis` and `redis (node_redis)` both require Common Name to match. All clients support RSA and ECDSA key algorithm. None of them seem accept AltName schemes via Distinguished Name.

Going deeper `redis (node_redis)` client may avoid rejection of unauthorized TLS similar to what can be accomplished via environment variable `NODE_TLS_REJECT_UNAUTHORIZED='0'`. Due retry configuration `ioredis` may require debugging to discover TLS-error given, it does however also appear some information in stardard error.

### TAP

```tap
TAP version 13
not ok 1 test_azure_recommended_self_signed_ca (tests.test_redis.RedisTests)
not ok 2 test_azure_recommended_self_signed_ca_no_certs (tests.test_redis.RedisTests)
ok 3 test_ecdsa (tests.test_redis.RedisTests)
ok 4 test_official_documentation_self_signed (tests.test_redis.RedisTests)
not ok 5 test_official_documentation_self_signed_no_certs (tests.test_redis.RedisTests)
ok 1 - ioredis : should support the documented self-signed certificates
not ok 2 - ioredis : should support the azure documented self-signed ca
ok 3 - ioredis : supports ECDSA
ok 4 - redis (node_redis) : supports ECDSA
not ok 5 - redis (node_redis) : should support the azure documented self-signed ca
ok 6 - redis (node_redis) : should support the documented self-signed certificates
ok 7 - redis (node_redis) : should support the azure documented self-signed ca with reject unauthorized false argument
ok 8 - redis (node_redis) : should support the documented self-signed certificates with reject unauthorized false argument
ok 9 - env : should support the documented self-signed certificates with reject unauthorized zero env
ok 10 - env : should support the azure documented self-signed ca with reject unauthorized zero env
```
