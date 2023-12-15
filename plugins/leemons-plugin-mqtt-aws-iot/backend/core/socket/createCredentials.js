const { LeemonsError } = require('@leemons/error');
const { getEndpointData } = require('./getEndpointData');
const { getRegion, getFederationToken } = require('./aws');

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
    console.error('Error in createCredentials - ', err);
    throw err;
  }
}

module.exports = { createCredentials };
