"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// import { test, describe, before, after } from 'node:test';
const node_assert_1 = __importDefault(require("node:assert"));
const ioredis_1 = __importDefault(require("ioredis"));
const IOREDIS_OPTIONS = {
    host: 'localhost',
    maxRetriesPerRequest: 0,
};
let clients = [
    ['redis', () => new ioredis_1.default({ ...IOREDIS_OPTIONS, port: 7088 })],
    ['garnet', () => new ioredis_1.default({ ...IOREDIS_OPTIONS, port: 3278 })]
];
describe.each(clients)("ioredis %p", async (_, clientFn) => {
    const client = clientFn();
    afterAll(() => {
        client.disconnect();
    });
    (0, globals_1.test)("Set and get %p", async () => {
        const set = await client.set('sdASD', 'IOG');
        const get = await client.get('sdASD');
        node_assert_1.default.equal(set, 'OK');
        node_assert_1.default.equal(get, 'IOG');
    });
    (0, globals_1.test)("Garnet: getset", async () => {
        const set = await client.set('someKey', 'first_value');
        const getset = await client.getset('someKey', 'fin');
        const finalGet = await client.get('someKey');
        node_assert_1.default.equal(set, 'OK');
        node_assert_1.default.equal(getset, 'first_value');
        node_assert_1.default.equal(finalGet, 'fin');
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
