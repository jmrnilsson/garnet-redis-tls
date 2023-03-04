# A dive into client support of Redis with self-signed certificates

## Description
A probe into self-signed TLS support for some redis clients: `ioredis`, `redis (node_redis)` and `redis (Python)`.
This would be useful when Redis is used behind a firewall which could be the case for Kubernetes when not using a
service mesh, like [Istio](https://istio.io/latest/about/service-mesh/) or [Linkerd](https://linkerd.io/), for mTLS.

## Requirements
- Windows 10
- Python 3.10+
- Node v.18 LTS
- Powershell Core v.6+ (typically shipped with Windows 10+)
- WSL2

## Background 
I don't know exactly what's going on here. But TLS support for redis doesn't appear to be a a priority. There is [this
post](http://antirez.com/news/96) from the author; then a [follow-up](http://antirez.com/news/118). There are some
pretty decent looking [performance measurements](https://github.com/redis/redis/issues/7595). There's the note about
lack of IO threading in [the official documentation](https://redis.io/docs/management/security/encryption/). And then 
some more ideas on connection pooling here (TBD). There is this [stale repo](https://github.com/josiahcarlson/redis-tls)
from where TLS probably reintegrated from once. And that team had a funny story that they aren't ready to be share yet.

Additionally, there are a lot of invalid documentation there references old version of clients and poorly though
through blog posts. There are also a trove of unanswered questions asked in Stackoverflow.com when it comes to redis and
TLS. 

> _In conclusiong finding a client library can run self-signed TLS reliably wasn't exactly easy. I reckon Redis can be
> put as a sidecar with UNIX sockets._

## Getting started
Open WSL terminal and run:

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
| Name | Description |
|------|------|
| ERR_TLS_CERT_ALTNAME_INVALID | Hostname/IP does not match certificate's altnames: Host: localhost. is not cert's CN: Generic-cert or 'Host: localhost. is not cert's CN: Generic-cert', host: 'localhost'. |
| CERTIFICATE_VERIFY_FAILED | certificate verify failed: self signed certificate (_ssl.c:1129). |
| ENV_REJECT_UNAUTH | Environment variable set to `NODE_TLS_REJECT_UNAUTHORIZED=0`. |
| ARG_REJECT_UNAUTH | Redis client constructed with rejectUnauthorized=false argument. |
| NO_VERIFY | Connection established but no certificate verification. |
| OFFDOC | Certificates self-signed per official Redis documentation. |
| AZCA | Certificates self-signed per Microsoft Azure custom root CA example. |

### Test runs
Based on integration tests. Still hoping things will improve with some tweaking of certificate generation.

| Client | Version | Run configuration | Status |
|------|------|------|------|
| `redis (node_redis)` | 4.6.5 | OFFDOC | ⛔ ERR_TLS_CERT_ALTNAME_INVALID |
| `redis (node_redis)` | 4.6.5 | AZCA  | ⛔ ERR_TLS_CERT_ALTNAME_INVALID |
| `redis (node_redis)` | 4.6.5 | OFFDOC + ENV_REJECT_UNAUTH | ⚠ NO_VERIFY |
| `redis (node_redis)` | 4.6.5 | AZCA + ENV_REJECT_UNAUTH | ⚠ NO_VERIFY |
| `redis (node_redis)` | 4.6.5 | OFFDOC + ARG_REJECT_UNAUTH | ⚠ NO_VERIFY |
| `redis (node_redis)` | 4.6.5 | AZCA + ARG_REJECT_UNAUTH | ⚠ NO_VERIFY |
| `ioredis` | 5.3.1 | OFFDOC | ⛔ ERR_TLS_CERT_ALTNAME_INVALID |
| `ioredis` | 5.3.1 | AZCA   | ⛔ ERR_TLS_CERT_ALTNAME_INVALID |
| `redis (Python)` | 4.5.1 | OFFDOC | ✅ OK |
| `redis (Python)` | 4.5.1 | AZCA | ⛔ CERTIFICATE_VERIFY_FAILED |

## Drill-down
Some modules will only log and test runner may hide this information (ioredis). To drill-down you may have to run
`node .\debug.js` to capture log output.

## TL;DR
For now it seems ioredis and redis (node_redis) only supports self-signed certificates, well technical any certificate,
when it is modulates at the environment variable: `NODE_TLS_REJECT_UNAUTHORIZED=0` or by configuring your npm
environment this way. More information pending. The usefulness of the supported rejectUnauthorized is unverified for 
now.

Clearly, it would be benefitial to only allow unauthorized for specifically redis rather than all any TLS-connection in
node.
