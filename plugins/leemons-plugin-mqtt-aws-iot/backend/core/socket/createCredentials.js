const { getEndpointData } = require('./getEndpointData');
const { getRegion, getFederationToken } = require('./aws');
const { LeemonsError } = require('leemons-error');

async function createCredentials({ policy, ctx }) {
  try {
    if (!policy) throw new LeemonsError(ctx, { message: 'Policy is required' });
    const [host, region, data] = await Promise.all([
      getEndpointData({ ctx }),
      getRegion({ ctx }),
      getFederationToken({ policy, ctx }),
    ]);

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
