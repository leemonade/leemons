const { schema } = require('./schemas/response/canResetRest');
const { schema: xRequest } = require('./schemas/request/canResetRest');

const openapi = {
  summary: 'Determine if a user can reset their password',
  description: `This endpoint checks if the requesting user has the ability to perform a password reset. It assesses various conditions such as the user's account status, any specific locks, or security settings that might prevent a password reset operation.

**Authentication:** User authentication is required to access this endpoint. A valid session or security token needs to be presented to allow for the identity verification of the requester.

**Permissions:** Users need to have the 'user.canResetPassword' permission explicitly set in their profile to initiate a password reset. Without this permission, the request will be denied, ensuring that only authorized users can attempt to reset their passwords.

The flow of this controller involves initially receiving the request and extracting the user's credential details from it. This information is then used to check against existing records and configurations in a security module that enforces password policies and user account states. Dependent on these conditions, the function \`canUserResetPassword\` is executed, which evaluates if the user meets all the requirements for a password reset. It considers factors like account status (active, locked, etc.), security policies regarding password resets, and any recent activity that might influence security decisions. If all conditions are satisfied, the endpoint will confirm that the password reset can proceed.`,
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
