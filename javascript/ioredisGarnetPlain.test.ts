import { expect, test} from '@jest/globals';
// import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import Redis from 'ioredis';

const IOREDIS_OPTIONS = {
  host: 'localhost',
  maxRetriesPerRequest: 0,
}

let clients: [string, () => Redis][] = [
  ['redis', () => new Redis({...IOREDIS_OPTIONS, port: 7088})],
  ['garnet', () => new Redis({...IOREDIS_OPTIONS, port: 3278})]
];

describe.each(clients)("ioredis %p", async (_, clientFn) => {
  const client: Redis = clientFn();
  
  afterAll(() => {
    client.disconnect();
  });

  test("Set and get %p", async () => {
    const set = await client.set('sdASD', 'IOG');
    const get = await client.get('sdASD');
    expect(set).toBe('OK');
    expect(get).toBe('IOG');
  });

  test("Garnet: getset", async () => {
    const set = await client.set('someKey', 'first_value');
    const getset = await client.getset('someKey', 'fin');
    const finalGet = await client.get('someKey');
    assert.equal(set, 'OK');
    assert.equal(getset, 'first_value');
    assert.equal(finalGet, 'fin');
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