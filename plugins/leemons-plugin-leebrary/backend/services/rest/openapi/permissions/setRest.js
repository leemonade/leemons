const { schema } = require('./schemas/response/setRest');
const { schema: xRequest } = require('./schemas/request/setRest');

const openapi = {
  summary: 'Set permissions for a specific asset or user',
  description: `This endpoint handles the setting of permissions for specific assets or users within the system. It allows administrators or authorized users to define who can access or modify certain resources, thereby enhancing control and security over sensitive information or functionalities.

**Authentication:** Users need to be authenticated to access this endpoint. The presence and validity of an authentication token are crucial for processing the request.

**Permissions:** This endpoint requires administrative privileges or specific role-based permissions that allow a user to manage and assign permissions within the platform.

Upon receiving a request, the \`setRest\` action starts by parsing incoming data to identify the target (either an asset or a user) and the desired permissions to be set. It then invokes the \`setPermissions\` method from the permissions core logic, which checks existing permission levels, validates the roles of the involved parties, and applies the new settings accordingly. This process may involve multiple validation layers to ensure only authorized modifications are made. If successful, the method returns a confirmation of the updated permissions, which is then forwarded to the user as the final response.`,
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
