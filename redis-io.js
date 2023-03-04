const Redis = require('ioredis');
const fs = require('fs');

async function tls() {
  const client = new Redis({
      host: 'localhost',
      port: 6379,
      tls: {
        key: fs.readFileSync('./redis/az-tls/redis.key', 'ascii'),
        cert: fs.readFileSync('./redis/az-tls/redis.crt', 'ascii'),
        ca: [fs.readFileSync('./redis/az-tls/ca.crt', 'ascii')]
      }
  });

  // await client.connect();
  await client.set('foo', 'bar');
  const response = await client.get('foo');
  console.log(response);
}

tls();