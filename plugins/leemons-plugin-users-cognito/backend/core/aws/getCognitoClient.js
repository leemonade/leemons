const { getAWSCredentials, getAWSConfig } = require('@leemons/aws/src');
const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');

/**
 *
 * @param {object} props
 * @param {import('moleculer').Context} props.ctx
 * @returns {CognitoIdentityProviderClient}
 */

async function getCognitoClient({ ctx }) {
  if (ctx.locals.AWS_CLIENT_COGNITO) {
    return ctx.locals.AWS_CLIENT_COGNITO;
  }

  const credentials = await getAWSCredentials({ prefix: 'cognito', ctx });

  const client = new CognitoIdentityProviderClient(getAWSConfig({ credentials }));

  ctx.locals.AWS_CLIENT_COGNITO = client;

  return client;
}

module.exports = getCognitoClient;
