const { schema } = require('./schemas/response/registerPasswordRest');
const { schema: xRequest } = require('./schemas/request/registerPasswordRest');

const openapi = {
  summary: 'Registers a new password for the user',
  description: `This endpoint allows a user to register a new password as part of the user account setup or password reset process. The registration involves validating the password strength and ensuring it complies with the platform's security requirements.

**Authentication:** User authentication is not required for this endpoint as it typically part of an initial setup or password reset flow.

**Permissions:** No permissions are required to access this endpoint as it is designed for users who are in the process of setting up their account or resetting their password.

Upon receiving a password registration request, the endpoint validates the provided password against defined security policies to ensure it meets the minimum security standards. If the password is valid, it proceeds to securely hash the password using bcrypt and updates the user's password in the database. This process ensures that the user's new password is securely stored and ready for use in subsequent authentications. The response to the client confirms whether the password was successfully registered or provides details about any errors encountered during the process.`,
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
