const { schema } = require('./schemas/response/adminAddUsersToRoomRest');
const {
  schema: xRequest,
} = require('./schemas/request/adminAddUsersToRoomRest');

const openapi = {
  summary: 'Add user agents to a room with admin privileges',
  description: `This endpoint allows an admin to add multiple user agents to a specific room. The operation is performed only if the initiating user possesses sufficient administrative rights.

**Authentication:** The user must be authenticated and identified as an administrator to execute this action. Unauthorized or unauthenticated requests are rejected.

**Permissions:** The user needs to have 'admin' level permissions specifically for room management. This includes the ability to modify room memberships and settings.

Upon receiving a request, the endpoint initially verifies if the authenticated user has administrative rights with respect to room management. If the verification succeeds, it proceeds to invoke the \`adminAddUserAgents\` function from the \`room\` core module. This function takes a list of user agent IDs and the target room ID, then adds these user agents to the room if they are not already present. The operation handles each addition transactionally, ensuring that all specified user agents are added successfully or none at all, in case of errors. Detailed logs are maintained for the operations to facilitate debugging and auditing. Upon completion, a success message or an error message, detailing the reason for failure, is sent back in the response.`,
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
