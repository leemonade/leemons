const { SetUserPoolMfaConfigCommand } = require('@aws-sdk/client-cognito-identity-provider');
const getCognitoClient = require('../../getCognitoClient');

/**
 * @param {object} props
 * @param {string} props.userPoolId
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function enableMFA({ userPoolId, ctx }) {
  const client = await getCognitoClient({ ctx });

  const command = new SetUserPoolMfaConfigCommand({
    UserPoolId: userPoolId,
    MfaConfiguration: 'OPTIONAL',
    SoftwareTokenMfaConfiguration: {
      Enabled: true,
    },
  });

  await client.send(command);
}

module.exports = enableMFA;
