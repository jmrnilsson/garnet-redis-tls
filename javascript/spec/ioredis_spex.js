const _ = require('./setup.js');
const rpc = require('../../js/rpc.js');

describe("ioredis", function () {
  xit("RSA : CN", async function () {
    const response = await rpc.ioredisSupportsDocumentedSelfSignedCertificates();
    expect(response).toEqual('goo');
  });

  xit("ECDSA zero depth CA", async function () {
    const response = await rpc.ioredisSupportsAzureDocumentedSelfSignedCa();
    expect(response).toEqual('doing');
  });

  xit("ECDSA : CN", async function () {
    const response = await rpc.ioredisSupportsEcdsa();
    expect(response).toEqual('ioEcdsa');
  });

});
