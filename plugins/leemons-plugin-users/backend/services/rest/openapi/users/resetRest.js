const { schema } = require('./schemas/response/resetRest');
const { schema: xRequest } = require('./schemas/request/resetRest');

const openapi = {
  summary: 'Reset user account password',
  description: `This endpoint allows users to reset their account password. It handles the password reset process by sending a reset link or code, and validating user-provided credentials to enable the creation of a new password.

**Authentication:** Users do not need to be logged in to access this endpoint, as it is typically used by those who have lost access to their account and cannot log in.

**Permissions:** No explicit permissions are required to initiate a password reset request. However, some form of user identification (such as an email or username) is typically required to validate the request.

The \`resetRest\` handler begins by validating the data received from the user, such as an email or username. It then calls the \`sendResetPasswordInstructions\` method, which generates a password reset token and sends it to the user's registered email address. The user must follow the instructions in the email to reset their password. Upon submission of the new password and token, the endpoint invokes the \`resetPassword\` service action to update the user’s password in the database. The entire process is secured to prevent unauthorized password reset attempts, and clear success or error messages are communicated back to the client.`,
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
