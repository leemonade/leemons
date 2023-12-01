const { schema } = require('./schemas/response/detailRest');
const { schema: xRequest } = require('./schemas/request/detailRest');

const openapi = {
  summary: 'Provides detailed user information',
  description: `This endpoint provides the complete details of a specific user account, including personal information, role, and permissions associated with the user.

**Authentication:** User authentication is required to access this endpoint. Unauthenticated access will be rejected with proper error handling.

**Permissions:** The user must have the 'view_user_details' permission to access another user's detailed information. Without the adequate permissions, access will be denied.

The endpoint initializes by invoking the \`detail\` action within the \`users\` service. It then utilizes various methods like \`getUserDetails\`, \`checkUserPermissions\`, and \`formatUserResponse\` to compile and format the user data. The process includes validation of the requesting user's token, ensuring proper authentication, and verification of permissions to access the requested user details. After passing the authentication and permissions checks, it fetches the user's detailed information from the database. Finally, the response is constructed with the user's information and sent back to the client.`,
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
