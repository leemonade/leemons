const { schema } = require('./schemas/response/registerPasswordRest');
const { schema: xRequest } = require('./schemas/request/registerPasswordRest');

const openapi = {
  summary: "Register a user's password for their account",
  description: `This endpoint allows a user to set or register a new password for their account as part of the account activation or recovery process. The password registration process ensures users create a secure authentication credential for future logins.

**Authentication:** This endpoint may be accessed without the user being logged in, as it pertains to users who are setting their password for the first time or recovering access to their account.

**Permissions:** This endpoint does not require specific permissions, as it is designed for users who are either activating their account or going through password recovery procedures.

Upon receiving a password registration request, the endpoint first calls the \`setUserForRegisterPassword\` method, validating the provided token to ensure it corresponds to a valid user awaiting password set up or recovery. It then proceeds to encrypt the new password using the \`encryptPassword\` function from the \`bcrypt\` core module, ensuring that the password is stored securely. After successful encryption, the endpoint updates the user's password in the database. If configured, the endpoint may trigger additional actions, such as sending a confirmation email via the \`sendWelcomeEmailToUser\` method or setting up user-specific configurations. The endpoint's response to the client confirms the successful registration of the new password.`,
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
