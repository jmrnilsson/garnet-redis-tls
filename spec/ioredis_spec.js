const _ = require('./setup.js');
const rpc = require('../js/rpc');

describe("ioredis", function () {
  it("should support the documented self-signed certificates", async function () {
    const response = await rpc.ioredisSupportsDocumentedSelfSignedCertificates();
    expect(response).toEqual('goo');
  });

  it("should support the azure documented self-signed ca", async function () {
    const response = await rpc.ioredisSupportsAzureDocumentedSelfSignedCa();
    expect(response).toEqual('doing');
  });

  it("supports ECDSA", async function () {
    const response = await rpc.ioredisSupportsEcdsa();
    expect(response).toEqual('ioEcdsa');
  });

});
