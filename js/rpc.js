const redis = require('redis');
const Redis = require('ioredis');
const { hasUncaughtExceptionCaptureCallback } = require('process');
// const fs = require('fs');
const fs = require('fs').promises;

const official_certificates = [
  7002,
  './redis/tests/tls/redis.key',
  './redis/tests/tls/redis.crt',
  './redis/tests/tls/ca.crt'
]

const az_ca_certificates = [
  7000,
  './redis-az-ca/az-tls/redis.key',
  './redis-az-ca/az-tls/redis.crt',
  './redis-az-ca/az-tls/ca.crt',
]

async function clientFactory(module, certificates, format='ascii'){
  if (module === "redis-unauthorized"){
    return redis.createClient({
      socket: {
        host: 'localhost',
        port: String(certificates[0]),
        tls: true,
        rejectUnauthorized: false,
      }
    });
  }

  const [port, key, cert, ca] = certificates;
  const keyTask = fs.readFile(key, format);
  const certTask = fs.readFile(cert, format);
  const caTask = fs.readFile(ca, format);

  if (module === "redis"){
    return redis.createClient({
      socket: {
        host: 'localhost',
        port: String(port),
        tls: true,
        key: await keyTask,
        cert: await certTask,
        ca: [await caTask],
      }
    });
  }

  if (module === "ioredis"){
    return new Redis({
      host: 'localhost',
      port: port,
      maxRetriesPerRequest: 0,
      tls: {
        key: await keyTask,
        cert: await certTask,
        ca: [await caTask],
        }
    });
  }

  throw Error(`Module ${module} unsupported.`)
}

async function redisSupportsDocumentedSelfSignedCertificates() {
  const client = await clientFactory("redis", official_certificates);
  await client.connect();
  await client.set('foo', 'fighters');
  return await client.get('foo');
}

async function redisSupportsAzureDocumentedSelfSignedCa() {
  const client = await clientFactory("redis", az_ca_certificates);
  await client.connect();
  await client.set('foo', 'ram');
  return await client.get('foo');
}

async function redisSupportsUnauthorizedDocumentedSelfSignedCertificates() {
  noCertificates = [official_certificates[0], null, null, null]
  const client = await clientFactory("redis-unauthorized", noCertificates);
  await client.connect();
  await client.set('foo', 'fighters');
  return await client.get('foo');
}

async function redisSupportsUnauthorizedAzureDocumentedSelfSignedCa() {
  noCertificates = [az_ca_certificates[0], null, null, null]
  const client = await clientFactory("redis-unauthorized", noCertificates);
  await client.connect();
  await client.set('foo', 'ram');
  return await client.get('foo');
}

async function ioredisSupportsDocumentedSelfSignedCertificates() {
  const client = await clientFactory("ioredis", official_certificates);
  await client.set('foo', 'goo');
  return await client.get('foo');
}

async function ioredisSupportsAzureDocumentedSelfSignedCa() {
  const client = await clientFactory("ioredis", az_ca_certificates);
  await client.set('foo', 'doing');
  return await client.get('foo');
}

exports.redisSupportsDocumentedSelfSignedCertificates = redisSupportsDocumentedSelfSignedCertificates
exports.redisSupportsAzureDocumentedSelfSignedCa = redisSupportsAzureDocumentedSelfSignedCa
exports.redisSupportsUnauthorizedDocumentedSelfSignedCertificates = redisSupportsUnauthorizedDocumentedSelfSignedCertificates
exports.redisSupportsUnauthorizedAzureDocumentedSelfSignedCa = redisSupportsUnauthorizedAzureDocumentedSelfSignedCa
exports.ioredisSupportsDocumentedSelfSignedCertificates = ioredisSupportsDocumentedSelfSignedCertificates
exports.ioredisSupportsAzureDocumentedSelfSignedCa = ioredisSupportsAzureDocumentedSelfSignedCa