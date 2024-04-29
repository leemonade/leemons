const { schema } = require('./schemas/response/resetRest');
const { schema: xRequest } = require('./schemas/request/resetRest');

const openapi = {
  summary: 'Reset user password',
  description: `This endpoint allows a user to reset their password using a valid reset token received via email. It facilitates users in recovering access to their accounts when they have forgotten their current password.

**Authentication:** No prior user authentication is required to access this endpoint as it is designed for users who are unable to log in due to forgotten passwords.

**Permissions:** There are no specific permissions needed to initiate a password reset request; however, the process requires a valid reset token which serves as a temporary authorization proving the request's legitimacy.

The reset process is initiated when the user submits a request to this endpoint with the required reset token and a new password. The \`reset\` action in the users service first validates the provided reset token to ensure it is active and legitimate. It then proceeds to encrypt the new password using secure hashing algorithms and updates the user's password in the database. Upon successful update, the token is marked as used, preventing reuse, thus enhancing security. The user receives confirmation of the reset either via a success response or an error message if any step fails.`,
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
