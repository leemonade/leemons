const { DeleteIdentityProviderCommand } = require('@aws-sdk/client-cognito-identity-provider');
const getCognitoClient = require('../../getCognitoClient');

/**
 * Add an identity provider to a user pool
 * @param {object} props
 * @param {string} props.userPoolId - The user pool id
 * @param {string} props.identityProvider - The identity provider to add
 * @param {import('@leemons/deployment-manager').Context} props.ctx - The context
 */
async function deleteIdentityProvider({ userPoolId, identityProvider, ctx }) {
  const client = await getCognitoClient({ ctx });

  const command = new DeleteIdentityProviderCommand({
    ProviderName: identityProvider.name,
    UserPoolId: userPoolId,
  });

  await client.send(command);
}

module.exports = deleteIdentityProvider;
