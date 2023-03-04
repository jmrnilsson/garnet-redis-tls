const rpc = require('../js/rpc');

describe("redis (node_redis)", function () {
  it("should support the documented self-signed certificates", async function () {
    const response = await rpc.redisSupportsDocumentedSelfSignedCertificates();
    expect(response).toEqual('fighters');
  });

  it("should support the azure documented self-signed ca", async function () {
    const response = await rpc.redisSupportsAzureDocumentedSelfSignedCa();
    expect(response).toEqual('ram');
  });

  it("should support the documented self-signed certificates with reject unauthorized false argument", async function () {
    const response = await rpc.redisSupportsUnauthorizedDocumentedSelfSignedCertificates();
    expect(response).toEqual('fighters');
  });

  it("should support the azure documented self-signed ca with reject unauthorized false argument", async function () {
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

describe("ioredis", function () {
  it("should support the documented self-signed certificates", async function () {
    const response = await rpc.ioredisSupportsDocumentedSelfSignedCertificates();
    expect(response).toEqual('goo');
  });

  it("should support the azure documented self-signed ca", async function () {
    const response = await rpc.ioredisSupportsAzureDocumentedSelfSignedCa();
    expect(response).toEqual('doing');
  });
});
