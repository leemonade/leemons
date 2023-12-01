const { schema } = require('./schemas/response/recoverRest');
const { schema: xRequest } = require('./schemas/request/recoverRest');

const openapi = {
  summary: "Initiates the user's password recovery process",
  description: `This endpoint initiates the process for a user to recover access to their account by starting the password reset sequence. It typically involves verifying the user's identity and sending a password reset link or code to the user's registered email address.

**Authentication:** Users do not need to be logged in to access this endpoint, as it is designed for those who have lost access to their account.

**Permissions:** No permissions are required to access this endpoint, as it is accessible by any user who needs to recover their account.

Upon receiving a request, the handler invokes the \`recover\` function from the \`Users\` core. This function validates the provided user credentials, ensuring that the account exists and that the email address matches the one on file. If validation is successful, the system generates a password reset token and dispatches an email to the user with instructions on how to reset their password. The process typically includes security measures to verify the user's identity and to ensure the reset token is used within a certain timeframe for added security. Ultimately, this endpoint serves to create a seamless and secure experience for users to regain access to their accounts.`,
  AIGenerated: 'true',
  'x-request': xRequest,
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema,
        },
      },
    },
  },
};

module.exports = {
  openapi,
};
