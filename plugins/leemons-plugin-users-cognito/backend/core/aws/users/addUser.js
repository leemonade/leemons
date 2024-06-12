const { AdminCreateUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const getCognitoClient = require('../getCognitoClient');

/**
 *
 * @param {object} props
 * @param {string} props.userPoolId - The user pool id
 * @param {string} props.userEmail
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function addUser({ userPoolId, userEmail, ctx }) {
  const client = await getCognitoClient({ ctx });

  const command = new AdminCreateUserCommand({
    UserPoolId: userPoolId,
    Username: userEmail,
    UserAttributes: [
      {
        Name: 'email',
        Value: userEmail,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
    DesiredDeliveryMediums: ['EMAIL'],
  });

  const { User } = await client.send(command);

  return User.Username;
}

module.exports = addUser;
