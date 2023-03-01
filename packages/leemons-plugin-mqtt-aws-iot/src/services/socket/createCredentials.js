const { getEndpointData } = require('./getEndpointData');
const { getRegion, getFederationToken } = require('./aws');

async function createCredentials(policy) {
  try {
    if (!policy) throw new Error('Policy is required');
    const host = await getEndpointData();
    const region = await getRegion();
    const data = await getFederationToken(policy);

    return {
      sessionExpiration: data.Credentials.Expiration,
      connectionConfig: {
        host,
        region,
        protocol: 'wss',
        accessKeyId: data.Credentials.AccessKeyId,
        secretKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken,
      },
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { createCredentials };
