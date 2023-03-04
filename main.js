const redis = require('redis');
const Redis = require('ioredis');
const fs = require('fs');

// https://github.com/redis/node-redis/blob/master/docs/client-configuration.md#TLS
async function recommened_self_signed() {
  const client = redis.createClient({
    socket: {
      host: 'localhost',
      port: '7002',
      tls: true,
      key: fs.readFileSync('./redis/tests/tls/redis.key', encoding = 'ascii'),
      cert: fs.readFileSync('./redis/tests/tls/redis.crt', encoding = 'ascii'),
      ca: [fs.readFileSync('./redis/tests/tls/ca.crt', encoding = 'ascii')],
      rejectUnauthorized: true,
    }
  });

  await client.connect();
  await client.set('foo', 'bar');
  const response = await client.get('foo');
  console.log(response);
}

async function test_azure_recommended_self_signed_ca() {
  const client = redis.createClient({
    socket: {
      host: 'localhost',
      port: '7000',
      tls: true,
      key: fs.readFileSync('./redis-az-ca/az-tls/redis.key', encoding = 'ascii'),
      cert: fs.readFileSync('./redis-az-ca/az-tls/redis.crt', encoding = 'ascii'),
      ca: [fs.readFileSync('./redis-az-ca/az-tls/ca.crt', encoding = 'ascii')],
      rejectUnauthorized: true,
    }

  });

  await client.connect();
  await client.set('foo', 'bar');
  const response = await client.get('foo');
  console.log(response);
}

async function test_io_azure_recommended_self_signed_ca() {
  const client = new Redis({
      host: 'localhost',
      port: 7000,
      tls: {
        key: fs.readFileSync('./redis-az-ca/az-tls/redis.key', 'ascii'),
        cert: fs.readFileSync('./redis-az-ca/az-tls/redis.crt', 'ascii'),
        ca: [fs.readFileSync('./redis-az-ca/az-tls/ca.crt', 'ascii')]
      }
  });

  await client.ping();
  await client.set('foo', 'bar');
  const response = await client.get('foo');
  console.log(response);
}

async function run_all() {
  // await recommened_self_signed();
  // await test_azure_recommended_self_signed_ca();
  await test_io_azure_recommended_self_signed_ca();
}

run_all();