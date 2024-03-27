import { expect, test} from '@jest/globals';
// import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import Redis from 'ioredis';

type Db = 'Redis' | 'Garnet';

const IOREDIS_OPTIONS = {
  host: 'localhost',
  maxRetriesPerRequest: 0,
}

const clients: Record<Db, number> = { Redis: 7088, Garnet: 3278 };

describe.each(Object.entries(clients))("ioredis %p", (db, port) => {
  const client = new Redis({...IOREDIS_OPTIONS, port: Number(port) });
  
  afterAll(() => {
    client.disconnect();
  });

  test(`${db} - set and get`, async () => {
    const set = await client.set('sdASD', 'IOG');
    const get = await client.get('sdASD');
    expect(set).toBe('OK');
    expect(get).toBe('IOG');
  });

  test(`${db} - getset`, async () => {
    const set = await client.set('someKey', 'first_value');
    const getset = await client.getset('someKey', 'fin');
    const finalGet = await client.get('someKey');
    assert.equal(set, 'OK');
    assert.equal(getset, 'first_value');
    assert.equal(finalGet, 'fin');
  });
});
