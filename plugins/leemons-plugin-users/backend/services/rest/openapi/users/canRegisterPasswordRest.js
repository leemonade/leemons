const { schema } = require('./schemas/response/canRegisterPasswordRest');
const {
  schema: xRequest,
} = require('./schemas/request/canRegisterPasswordRest');

const openapi = {
  summary: "Check user's ability to set a new password",
  description: `This endpoint checks if a user is capable of setting or registering a new password based on the system's policy and the user's current state. This is often used during account recovery processes or initial account setup.

**Authentication:** This endpoint requires the user to be authenticated. If the user's authentication details are absent or incorrect, the endpoint will reject the request with an appropriate error message.

**Permissions:** Specific permission checks are implemented to ensure that only a user with rights to modify account credentials can invoke this endpoint. The required permission will typically be associated with the ability to update one's own password or complete an account setup.

Upon receiving a request, the handler initiates the \`canRegisterPassword\` action by calling the corresponding service method. This method validates the user's authentication state and ensures compliance with the platform's password policy. The policy may include checks for account activation status, password complexity requirements, or any other rules defined within the system. If the checks pass, the handler responds with an affirmative indication that the user can proceed to set or register a new password. Conversely, if the checks fail due to any policy violation or missing authorization, the handler denies the request and informs the user of the necessary criteria that must be met to proceed with setting a new password.`,
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
