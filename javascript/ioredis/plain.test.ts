import { expect, test} from '@jest/globals';
// import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import Redis, { RedisOptions } from 'ioredis';
import uuid4 from 'uuid4';
import incr from '../dbNumber';

type Db = 'Redis' | 'Garnet';

const IOREDIS_OPTIONS: RedisOptions = {
  host: 'localhost',
  maxRetriesPerRequest: 0,
}

const clients: Record<Db, number> = { Redis: 7088, Garnet: 3278 };

describe.each(Object.entries(clients))("ioredis %p", (db, port) => {
  const client = new Redis({...IOREDIS_OPTIONS, port: Number(port)});
  // const client = new Redis({...IOREDIS_OPTIONS, port: Number(port), db: incr()});
  
  afterAll(() => {
    client.disconnect();
  });

  test(`${db} - SET GET`, async () => {
    const set = await client.set('s-', 'IOG');
    const get = await client.get('s-');
    expect(set).toBe('OK');
    expect(get).toBe('IOG');
  });

  test(`${db} - GETSET`, async () => {
    const set = await client.set('someKey', 'first_value');
    const getset = await client.getset('someKey', 'fin');
    const finalGet = await client.get('someKey');
    assert.equal(set, 'OK');
    assert.equal(getset, 'first_value');
    assert.equal(finalGet, 'fin');
  });

  test(`${db} - ECHO`, async () => {
    const echo = await client.echo('_ping_');
    assert.equal(echo, '_ping_');
  });

  test(`${db} - SADD - SMEMBERS`, async () => {
    const sadd = await client.sadd('letters', 'a', 'X', 'yZy');
    const sadd0 = await client.sadd('letters', 'C', 'X', 'crafty');
    const smembers = await client.smembers('letters');
    assert.equal(smembers, ["a", "X", "yZy", "C", "crafty"]);
  });

  test(`${db} - EVAL`, async () => {
    // EVAL "return 'Hello, scripting!'" 0
    const eval_ = await client.eval("return 'Hello, scripting!", 0);
    assert.equal(eval_, 'ZyZs');
  });
  // EVAL "return ARGV[1]" 0 hello
  // "hello"
});
