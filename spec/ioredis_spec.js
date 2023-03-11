const _ = require('./setup.js');
const rpc = require('../js/rpc');

describe("ioredis", function () {
  it("RSA", async function () {
    const response = await rpc.ioredisSupportsDocumentedSelfSignedCertificates();
    expect(response).toEqual('goo');
  });

  it("ECDSA zero depth CA", async function () {
    const response = await rpc.ioredisSupportsAzureDocumentedSelfSignedCa();
    expect(response).toEqual('doing');
  });

  it("ECDSA", async function () {
    const response = await rpc.ioredisSupportsEcdsa();
    expect(response).toEqual('ioEcdsa');
  });

});
