import { test, describe } from 'node:test';
import Redis from 'ioredis';

const IOREDIS_OPTIONS = {
  host: 'localhost',
  port: 3278,
  maxRetriesPerRequest: 0,
}

async function ioredisSupportsGarnet() {
  const client = new Redis(IOREDIS_OPTIONS);
  await client.set('sdASD', 'ioGarny');
  return await client.get('sdASD');
}

describe("ioredis", function () {
  it("Garnet", async function () {
    const response = await ioredisSupportsGarnet();
    expect(response).toEqual('ioGarny');
  });
});
