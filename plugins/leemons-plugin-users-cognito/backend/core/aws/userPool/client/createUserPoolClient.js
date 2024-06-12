const { CreateUserPoolClientCommand } = require('@aws-sdk/client-cognito-identity-provider');
const getCognitoClient = require('../../getCognitoClient');
const getDeploymentDomains = require('../../../getDeploymentDomains');

/**
 *
 * @param {object} props
 * @param {string} props.userPoolId
 * @param {string[]} [props.identityProviders]
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function createUserPoolClient({ userPoolId, identityProviders = [], ctx }) {
  const { callbackURLs, logoutURLs } = await getDeploymentDomains({ ctx });

  const client = await getCognitoClient({ ctx });

  const command = new CreateUserPoolClientCommand({
    UserPoolId: userPoolId,
    ClientName: 'Leemons',
    GenerateSecret: false,
    RefreshTokenValidity: 1,
    AccessTokenValidity: 1,
    IdTokenValidity: 1,
    TokenValidityUnits: {
      AccessToken: 'hours',
      RefreshToken: 'hours',
      IdToken: 'hours',
    },
    ReadAttributes: ['email'],
    WriteAttributes: ['email'],
    SupportedIdentityProviders: identityProviders,
    CallbackURLs: callbackURLs,
    LogoutURLs: logoutURLs,
    AllowedOAuthFlows: ['code'],
    AllowedOAuthScopes: ['email', 'openid'],
    AllowedOAuthFlowsUserPoolClient: true,
    EnableTokenRevocation: true,
  });

  const result = await client.send(command);

  return result.UserPoolClient.ClientId;
}

module.exports = createUserPoolClient;
