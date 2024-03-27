const _ = require('./setup.js');
const rpc = require('../../js/rpc.js');

describe("node_redis", function () {
  xit("RSA : CN", async function () {
    const response = await rpc.redisSupportsDocumentedSelfSignedCertificates();
    expect(response).toEqual('fighters');
  });

  xit("ECDSA : CN", async function () {
    const response = await rpc.redisSupportsEcdsa();
    expect(response).toEqual('ecdsa');
  });

  xit("ECDSA : SAN", async function () {
    const response = await rpc.redisSupportsEcdsaSan();
    expect(response).toEqual('sunny');
  });

  // error properties: Object({ reason: 'Cert does not contain a DNS name', host: 'localhost', cert: Object({ subject: null({ C                                                                                                                         : 'SE', ST: 'Stockholm', L: 'Stockholm', O: 'Private', OU: 'None', emailAddress: 'None' }), issuer: null({ O: 'Redis Verificat                                                                                                                         ion', CN: 'Certificate Authority' }), bits: 256, pubkey: Buffer [ 4, 46, 23, 214, 219, 4, 145, 9, 62, 119, 168, 125, 4, 150, 2                                                                                                                         20, 106, 93, 122, 78, 10, 205, 219, 75, 54, 2, 225, 210, 100, 135, 5, 14, 26, 223, 170, 39, 48, 104, 179, 84, 188, 44, 130, 74                                                                                                                         , 133, 72, 10, 175, 181, 231, 209, ... ], asn1Curve: 'prime256v1', nistCurve: 'P-256', valid_from: 'Mar 11 07:21:23 2023 GMT',                                                                                                                          valid_to: 'Mar 10 07:21:23 2024 GMT', fingerprint: '74:19:AA:21:3B:F2:4A:C2:37:84:31:90:4B:A7:D1:A1:E1:C1:11:52', fingerprint                                                                                                                         256: 'DF:AA:AD:D7:B4:0A:53:16:93:51:57:9E:1E:61:8D:51:A3:95:7F:36:DF:F6:85:3F:67:B6:0E:D3:A3:94:AB:F0', fingerprint512: 'E7:1A                                                                                                                         :30:E3:0A:03:CC:75:43:C0:56:79:AD:BF:84:D6:D8:D3:86:60:9D:69:13:39:CB:5A:AE:64:B4:50:E0:11:41:69:88:E2:29:C8:9E:13:99:F9:E3:F0                                                                                                                         :BF:92:D0: ...

  ixitt("ECDSA zero depth CA", async function () {
    const response = await rpc.redisSupportsAzureDocumentedSelfSignedCa();
    expect(response).toEqual('ram');
  });
});


describe('node_redis : reject unauthorized : environment variable', function () {
  let originalRejectUnauthorized;

  beforeAll(async function () {
    // We cannot monkey patch the entire `process.env` because object has already been loaded as a dependency
    // apparently.
    originalRejectUnauthorized = process.env["NODE_TLS_REJECT_UNAUTHORIZED"];
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  });

  xit("RSA : CN", async function () {
    const response = await rpc.redisSupportsDocumentedSelfSignedCertificates();
    expect(response).toEqual('fighters');
  });

  xit("ECDSA zero depth CA", async function () {
    const response = await rpc.redisSupportsAzureDocumentedSelfSignedCa();
    expect(response).toEqual('ram');
  });

  afterAll(async function () {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = originalRejectUnauthorized;
  });
});

describe('node_redis : reject unauthorized : ctor', function () {
  xit("Reject unauthorized : RSA : CN", async function () {
    const response = await rpc.redisSupportsUnauthorizedDocumentedSelfSignedCertificates();
    expect(response).toEqual('fighters');
  });

  xit("Reject unauthorized : ECDSA : CN", async function () {
    const response = await rpc.redisSupportsUnauthorizedAzureDocumentedSelfSignedCa();
    expect(response).toEqual('ram');
  });
})