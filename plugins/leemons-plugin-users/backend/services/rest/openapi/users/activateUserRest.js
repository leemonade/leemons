const { schema } = require('./schemas/response/activateUserRest');
const { schema: xRequest } = require('./schemas/request/activateUserRest');

const openapi = {
  summary: 'Activates a newly registered user',
  description: `This endpoint confirms a user's email for account activation and marks the user's account as active in the system. It is used as part of the user registration process where a user must validate their email address to fully activate their account.

**Authentication:** A unique activation token is required, but the user does not need to be logged in, as this is part of the account activation process for new users.

**Permissions:** This endpoint does not require specific permissions since it's meant to be accessed by users who need to activate their new account.

Upon receiving an activation request, the endpoint calls the \`activateUser\` service action. The action expects an activation token, which is typically provided to the user via email upon registration. It validates the token and, if successful, sets the user's account status to active in the user management system. This includes updating the user record in the database to reflect the activation and sending back an affirmative response to the client to confirm that the account has been successfully activated. In case of failure, such as an invalid or expired token, the endpoint responds with an error message indicating that activation could not be completed.`,
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
