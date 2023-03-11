const _ = require('./setup.js');
const rpc = require('../js/rpc');

describe("node_redis", function () {
  it("RSA CN", async function () {
    const response = await rpc.redisSupportsDocumentedSelfSignedCertificates();
    expect(response).toEqual('fighters');
  });

  it("ECDSA CN", async function () {
    const response = await rpc.redisSupportsEcdsa();
    expect(response).toEqual('ecdsa');
  });

  it("ECDSA zero depth CA", async function () {
    const response = await rpc.redisSupportsAzureDocumentedSelfSignedCa();
    expect(response).toEqual('ram');
  });

  it("Reject unauthorized - ECDSA", async function () {
    const response = await rpc.redisSupportsUnauthorizedDocumentedSelfSignedCertificates();
    expect(response).toEqual('fighters');
  });

  it("Reject unauthorized - ECDSA", async function () {
    const response = await rpc.redisSupportsUnauthorizedAzureDocumentedSelfSignedCa();
    expect(response).toEqual('ram');
  });
});

describe('env', function () {
  let originalRejectUnauthorized;

  beforeAll(async function () {
    // We cannot monkey patch the entire `process.env` because object has already been loaded by dependency apparently.
    originalRejectUnauthorized = process.env["NODE_TLS_REJECT_UNAUTHORIZED"];
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  });

  it("should support the documented self-signed certificates with reject unauthorized zero env", async function () {
    const response = await rpc.redisSupportsDocumentedSelfSignedCertificates();
    expect(response).toEqual('fighters');
  });

  it("should support the azure documented self-signed ca with reject unauthorized zero env", async function () {
    const response = await rpc.redisSupportsAzureDocumentedSelfSignedCa();
    expect(response).toEqual('ram');
  });

  afterAll(async function () {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = originalRejectUnauthorized;
  });
});

