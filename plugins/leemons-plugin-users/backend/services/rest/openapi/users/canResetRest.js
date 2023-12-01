const { schema } = require('./schemas/response/canResetRest');
const { schema: xRequest } = require('./schemas/request/canResetRest');

const openapi = {
  summary: "Check user's ability to reset their password",
  description: `This endpoint checks if a user is allowed to reset their password according to the platform's reset policy configuration. The process evaluates various criteria, including the user's current state and any applicable restrictions that may prevent them from resetting their password.

**Authentication:** Users do not need to be logged in to use this endpoint. It's accessible without an active user session because it pertains to users who may have forgotten their password and need to initiate a password reset procedure.

**Permissions:** This endpoint does not specifically require any permissions, as it is designed to support users in the process of recovering access to their account. Hence, it is available to any user who needs to check their eligibility for password resetting.

Upon receiving a request, the handler calls the \`canReset\` method from the 'users' core, which determines if the user is eligible to reset their password. This involves checking the reset policies configured within the platform, such as minimum time intervals between reset requests or the type of users who may not be allowed to reset passwords (e.g., those with certain roles or security levels). If the user meets all the criteria, the endpoint responds with an affirmative indication that the user may proceed with the password reset process. Otherwise, it responds with a negative result and relevant error message explaining why the password reset cannot be initiated.`,
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
