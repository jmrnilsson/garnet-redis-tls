const redis = require('redis');
const Redis = require('ioredis');
const fs = require('fs').promises;

const _RSA = [
  7020,
  './redis/tests/tls/redis.key',
  './redis/tests/tls/redis.crt',
  './redis/tests/tls/ca.crt'
]

const _ECDSA = [
  7030,
  './tls-ecdsa/tls/redis.key',
  './tls-ecdsa/tls/redis.crt',
  './tls-ecdsa/tls/ca.crt'
]

const _ECDSA_SAN = [
  7040,
  './tls-ecdsa-san/tls/redis.key',
  './tls-ecdsa-san/tls/redis.crt',
  './tls-ecdsa-san/tls/ca.crt'
]

const _CUSTOM_ZERO_DEPTH_CA = [
  7000,
  './redis-az-ca/az-tls/redis.key',
  './redis-az-ca/az-tls/redis.crt',
  './redis-az-ca/az-tls/ca.crt',
]

async function clientFactory(module, certificates, format='ascii', password=null){
  if (module === "redis-unauthorized"){
    var options = {
      socket: {
        host: 'localhost',
        port: String(certificates[0]),
        tls: true,
        rejectUnauthorized: false,
      }
    }
    if (password) {
      options["password"] = password
    }
    return redis.createClient(options);
  }

  const [port, key, cert, ca] = certificates;
  const keyTask = fs.readFile(key, format);
  const certTask = fs.readFile(cert, format);
  const caTask = fs.readFile(ca, format);

  if (module === "redis"){
    var options = {
      socket: {
        host: 'localhost',
        port: String(port),
        tls: true,
        key: await keyTask,
        cert: await certTask,
        ca: [await caTask],
      }
    }
    if (password) {
      options["password"] = password
    }
    return redis.createClient(options);
  }

  if (module === "ioredis"){
    var options = {
      host: 'localhost',
      port: port,
      maxRetriesPerRequest: 0,
      tls: {
        key: await keyTask,
        cert: await certTask,
        ca: [await caTask],
        }
    }
    if (password) {
      options["password"] = password
    }
    return new Redis(options);
  }

  throw Error(`Module ${module} unsupported.`)
}

async function redisSupportsDocumentedSelfSignedCertificates() {
  const client = await clientFactory("redis", _RSA);
  await client.connect();
  await client.set('foo', 'fighters');
  return await client.get('foo');
}

async function redisSupportsAzureDocumentedSelfSignedCa() {
  const client = await clientFactory("redis", _CUSTOM_ZERO_DEPTH_CA);
  await client.connect();
  await client.set('foo', 'ram');
  return await client.get('foo');
}

async function redisSupportsUnauthorizedDocumentedSelfSignedCertificates() {
  noCertificates = [_RSA[0], null, null, null]
  const client = await clientFactory("redis-unauthorized", noCertificates);
  await client.connect();
  await client.set('foo', 'fighters');
  return await client.get('foo');
}

async function redisSupportsUnauthorizedAzureDocumentedSelfSignedCa() {
  noCertificates = [_CUSTOM_ZERO_DEPTH_CA[0], null, null, null]
  const client = await clientFactory("redis-unauthorized", noCertificates);
  await client.connect();
  await client.set('foo', 'ram');
  return await client.get('foo');
}

async function ioredisSupportsDocumentedSelfSignedCertificates() {
  const client = await clientFactory("ioredis", _RSA);
  await client.set('foo', 'goo');
  return await client.get('foo');
}

async function ioredisSupportsAzureDocumentedSelfSignedCa() {
  const client = await clientFactory("ioredis", _CUSTOM_ZERO_DEPTH_CA);
  await client.set('foo', 'doing');
  return await client.get('foo');
}

async function ioredisSupportsEcdsa() {
  const client = await clientFactory("ioredis", _ECDSA, format="ascii", password="vkIjyCjWsmepTCkaynqHwqDkqMVuATgvyQCDJBKNvhkwMoNykqkOzyYKCKYRqYtZYFBQjOstRoZlEKEMeiOQwDibhULpylxnuQsVhjNLtbkxeUfsGlwwGRjQaslESnVU");
  await client.set('doog', 'ioEcdsa');
  return await client.get('doog');
}

async function redisSupportsEcdsa() {
  const client = await clientFactory("redis", _ECDSA, format="ascii", password="vkIjyCjWsmepTCkaynqHwqDkqMVuATgvyQCDJBKNvhkwMoNykqkOzyYKCKYRqYtZYFBQjOstRoZlEKEMeiOQwDibhULpylxnuQsVhjNLtbkxeUfsGlwwGRjQaslESnVU");
  await client.connect();
  await client.set('zap', 'ecdsa');
  return await client.get('zap');
}

async function redisSupportsEcdsaSan() {
  const client = await clientFactory("redis", _ECDSA_SAN, format="ascii", password="vkIjyCjWsmepTCkaynqHwqDkqMVuATgvyQCDJBKNvhkwMoNykqkOzyYKCKYRqYtZYFBQjOstRoZlEKEMeiOQwDibhULpylxnuQsVhjNLtbkxeUfsGlwwGRjQaslESnVU");
  await client.connect();
  await client.set('roo', 'sunny');
  return await client.get('roo');
}

exports.redisSupportsDocumentedSelfSignedCertificates = redisSupportsDocumentedSelfSignedCertificates
exports.redisSupportsAzureDocumentedSelfSignedCa = redisSupportsAzureDocumentedSelfSignedCa
exports.redisSupportsUnauthorizedDocumentedSelfSignedCertificates = redisSupportsUnauthorizedDocumentedSelfSignedCertificates
exports.redisSupportsUnauthorizedAzureDocumentedSelfSignedCa = redisSupportsUnauthorizedAzureDocumentedSelfSignedCa
exports.ioredisSupportsDocumentedSelfSignedCertificates = ioredisSupportsDocumentedSelfSignedCertificates
exports.ioredisSupportsAzureDocumentedSelfSignedCa = ioredisSupportsAzureDocumentedSelfSignedCa
exports.ioredisSupportsEcdsa = ioredisSupportsEcdsa
exports.redisSupportsEcdsa = redisSupportsEcdsa
exports.redisSupportsEcdsaSan = redisSupportsEcdsaSan