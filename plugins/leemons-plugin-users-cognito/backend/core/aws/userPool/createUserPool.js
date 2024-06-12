const { CreateUserPoolCommand } = require('@aws-sdk/client-cognito-identity-provider');

const getCognitoClient = require('../getCognitoClient');

/**
 *
 * @param {object} props
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function createUserPool({ ctx }) {
  const { deploymentID } = ctx.meta;

  const client = await getCognitoClient({ ctx });

  const command = new CreateUserPoolCommand({
    PoolName: deploymentID,
    Policies: {
      PasswordPolicy: {
        MinimumLength: 8,
        RequireUppercase: true,
        RequireLowercase: true,
        RequireNumbers: true,
        RequireSymbols: true,
      },
    },
    DeletionProtection: 'ACTIVE',
    AutoVerifiedAttributes: ['email'],
    UsernameAttributes: ['email'],
    MfaConfiguration: 'OFF',
    EmailConfiguration: {
      EmailSendingAccount: 'COGNITO_DEFAULT',
      ReplyToEmailAddress: 'support@leemons.io',
    },
    UsernameConfiguration: {
      CaseSensitive: false,
    },
    AccountRecoverySetting: {
      RecoveryMechanisms: [
        {
          Priority: 1,
          Name: 'verified_email',
        },
      ],
    },
    Schema: [
      {
        Name: 'email',
        Required: true,
      },
    ],
  });

  const result = await client.send(command);

  return result.UserPool.Id;
}

module.exports = createUserPool;
