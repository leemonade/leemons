const { schema } = require('./schemas/response/canRegisterPasswordRest');
const {
  schema: xRequest,
} = require('./schemas/request/canRegisterPasswordRest');

const openapi = {
  summary: 'Determine if a user can register a new password',
  description: `This endpoint checks if a user is eligible to register a new password based on specific criteria defined by the system. The evaluation includes checks against user's current password state, security policies, and any other pre-defined system requirements.

**Authentication:** Users must be logged in to perform this action. They need to provide valid authentication credentials before making the request to ensure secure access to the password registration facility.

**Permissions:** The user needs to have specific permissions that allow them to update or change their password. Without these permissions, the request will be rejected and the action will not be performed.

Upon receiving a request, the handler initiates a series of checks to assess the eligibility of the user for password registration. It starts by verifying user authentication and then consulting the system's policy to determine if the user's current conditions satisfy the requirements for registering a new password. This may involve checking for the time since the last password change, password complexity requirements, and any other related security measures. If the checks are passed, the endpoint indicates that the user can proceed with password registration, otherwise, it denies the request with appropriate feedback.`,
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
