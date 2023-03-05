const debuggable = require("./js/rpc");

// https://github.com/redis/node-redis/blob/master/docs/client-configuration.md#TLS

async function debug() {
  // const response = await debuggable.ioredisSupportsAzureDocumentedSelfSignedCa();
  const response = await debuggable.ioredisSupportsDocumentedSelfSignedCertificates();
  // const response = await debuggable.redisSupportsAzureDocumentedSelfSignedCa();
  // const response = await debuggable.ioredisSupportsDocumentedSelfSignedCertificates();
  console.log(response);
}

debug();