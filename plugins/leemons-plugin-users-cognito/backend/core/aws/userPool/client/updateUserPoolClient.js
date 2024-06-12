const { UpdateUserPoolClientCommand } = require('@aws-sdk/client-cognito-identity-provider');
const getCognitoClient = require('../../getCognitoClient');
const getDeploymentDomains = require('../../../getDeploymentDomains');

/**
 * Update the user pool client
 * @param {object} props
 * @param {string} props.userPoolId - The user pool id
 * @param {string} props.clientId - The client id
 * @param {string[]} props.identityProviders - The identity providers
 * @param {import('@leemons/deployment-manager').Context} props.ctx - The context
 */
async function updateUserPoolClient({ userPoolId, clientId, identityProviders, ctx }) {
  const { callbackURLs, logoutURLs } = await getDeploymentDomains({ ctx });

  const client = await getCognitoClient({ ctx });

  const command = new UpdateUserPoolClientCommand({
    ClientId: clientId,
    UserPoolId: userPoolId,
    CallbackURLs: callbackURLs,
    LogoutURLs: logoutURLs,
    IdentityProviders: identityProviders,
  });

  const { UserPoolClient } = await client.send(command);

  return UserPoolClient.ClientId;
}

module.exports = updateUserPoolClient;
