const _ = require('./setup.js');
const Redis = require('ioredis');

const IOREDIS_OPTIONS = {
  // password: undefined,
  host: 'localhost',
  port: 3278,
  maxRetriesPerRequest: 0,
  // tls: {
  //   key: await keyTask,
  //   cert: await certTask,
  //   ca: [await caTask],
  //   }
}

async function ioredisSupportsGarnet() {
  const client =new Redis(IOREDIS_OPTIONS);
  await client.set('sdASD', 'ioGarny');
  return await client.get('sdASD');
}

describe("ioredis", function () {
  it("Garnet", async function () {
    const response = await ioredisSupportsGarnet();
    expect(response).toEqual('ioGarny');
  });
});
