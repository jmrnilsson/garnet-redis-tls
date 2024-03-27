import { test, describe } from 'node:test';
import assert from 'node:assert';
import Redis from 'ioredis';

const IOREDIS_OPTIONS = {
  host: 'localhost',
  // port: 3278,
  port: 7088,
  maxRetriesPerRequest: 0,
}

async function ioredisSupportsGarnet() {
  const client = new Redis(IOREDIS_OPTIONS);
  await client.set('sdASD', 'ioGarny');
  const result = await client.get('sdASD');
  client.disconnect();
  return result;
}

describe("ioredis (ts)", async () => {
  await test("Garnet", async () => {
    const response = await ioredisSupportsGarnet();
    assert.equal(response, 'ioGarny');
  });
});


// describe("ioredis (noop-ts)", async () => {
//   test("noop", async () => {
//     assert.equal("ASD", 'ASD');
//   });
// });


// test.only('this test is run', { only: true }, async (t) => {
//   // Within this test, all subtests are run by default.
// });

// // The 'only' option is not set, so this test is skipped.
// test('this test is not run', () => {
//   // This code is not run.
//   throw new Error('fail');
// }); 