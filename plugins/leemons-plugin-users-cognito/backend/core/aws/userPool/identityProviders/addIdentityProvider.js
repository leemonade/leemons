const { CreateIdentityProviderCommand } = require('@aws-sdk/client-cognito-identity-provider');
const getCognitoClient = require('../../getCognitoClient');

/**
 * @typedef {Object} IdentityProvider
 * @property {CreateIdentityProviderCommand["input"]["ProviderDetails"]} details - The identity provider details
 * @property {CreateIdentityProviderCommand["input"]["ProviderName"]} name - The identity provider name
 * @property {CreateIdentityProviderCommand["input"]["ProviderType"]} type - The identity provider type
 * @property {CreateIdentityProviderCommand["input"]["AttributeMapping"]} attributes - The identity provider attributes
 * @property {CreateIdentityProviderCommand["input"]["IdpIdentifiers"]} identifiers - The identity provider identifiers
 */

/**
 * Add an identity provider to a user pool
 * @param {object} props
 * @param {string} props.userPoolId - The user pool id
 * @param {IdentityProvider} props.identityProvider - The identity provider to add
 * @param {import('@leemons/deployment-manager').Context} props.ctx - The context
 * @returns {string} - The identity provider id
 */
async function addIdentityProvider({ userPoolId, identityProvider, ctx }) {
  const client = await getCognitoClient({ ctx });

  const command = new CreateIdentityProviderCommand({
    UserPoolId: userPoolId,

    ProviderDetails: identityProvider.details,
    ProviderName: identityProvider.name,
    ProviderType: identityProvider.type,
    AttributeMapping: identityProvider.attributes,
    IdpIdentifiers: identityProvider.identifiers,
  });

  const { IdentityProvider } = await client.send(command);

  return IdentityProvider.ProviderName;
}

module.exports = addIdentityProvider;
