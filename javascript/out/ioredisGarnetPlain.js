"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const ioredis_1 = __importDefault(require("ioredis"));
const IOREDIS_OPTIONS = {
    host: 'localhost',
    port: 3278,
    maxRetriesPerRequest: 0,
};
async function ioredisSupportsGarnet() {
    const client = new ioredis_1.default(IOREDIS_OPTIONS);
    await client.set('sdASD', 'ioGarny');
    const result = await client.get('sdASD');
    client.disconnect();
    return result;
}
(0, node_test_1.describe)("ioredis (ts)", async () => {
    let client = new ioredis_1.default(IOREDIS_OPTIONS);
    (0, node_test_1.after)(() => {
        client = undefined;
    });
    (0, node_test_1.test)("Garnet: set, get, getset", async () => {
        const set = await client.set('sdASD', 'ioGarny');
        const get = await client.get('sdASD');
        const getset = await client.getset('sdASD', 'fin');
        const get0 = await client.get('sdASD');
        node_assert_1.default.equal(set, 'OK');
        node_assert_1.default.equal(get, 'sdASD');
        node_assert_1.default.equal(getset, 'sdASD');
        node_assert_1.default.equal(get0, 'fin');
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
