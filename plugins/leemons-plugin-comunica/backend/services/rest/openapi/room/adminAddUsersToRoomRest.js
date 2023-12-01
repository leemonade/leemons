const { schema } = require('./schemas/response/adminAddUsersToRoomRest');
const {
  schema: xRequest,
} = require('./schemas/request/adminAddUsersToRoomRest');

const openapi = {
  summary: 'Add users to a specified room',
  description: `This endpoint allows an admin to add multiple user agents to a specified room, expanding the room’s participant list. The action involves updating the room's metadata to include the newly added users, facilitating them to access and interact within the room.

**Authentication:** Admin level authentication is required to perform this action. Attempting to use this endpoint without the appropriate admin credentials will result in access being denied.

**Permissions:** The user must possess administration-level permissions to modify room participant lists. Without the requisite permissions, the request will be rejected.

Upon receiving a request, the endpoint executes the \`adminAddUserAgents\` method located within the \`room\` core. It initiates the procedure by verifying the existence of the specified room and the user agents through the \`exists\` and \`existUserAgent\` validation functions. Once validated, the \`addUserAgents\` method is called to append the user agents to the room. Each step involves appropriate error handling to manage cases where validations fail, ensuring the database is only modified if all checks pass. The final response confirms the successful addition of user agents to the room, or details any encountered errors.`,
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
