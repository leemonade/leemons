const { schema } = require('./schemas/response/adminRemoveUserAgentRest');
const {
  schema: xRequest,
} = require('./schemas/request/adminRemoveUserAgentRest');

const openapi = {
  summary: 'Remove user agents from a room by an admin',
  description: `This endpoint allows admins to remove one or more user agents from a specific room. The admin provides the identifiers for the room and the user agents, and the service ensures that these agents are properly removed from the room, maintaining room integrity and access controls.

**Authentication:** Admins need to be authenticated to execute this operation. Non-authenticated requests or requests from non-admin users will be denied access to this functionality.

**Permissions:** The user must have administrative permissions specifically for room management. Without adequate permissions, the request will be rejected to uphold security protocols and manage room access properly.

The flow begins with the \`adminRemoveUserAgents\` method being called from the \`room.rest.js\` service file. This method first verifies the admin's credentials and permissions to manage room settings. Upon successful validation, it proceeds to invoke the \`removeUserAgents\` method from the \`core/room\` module, providing the necessary user and room identifiers. This core method handles the logical removal of user agents from the database, ensuring that all associated data integrity constraints are adhered to. A successful operation results in a confirmation of removal, while any failures in the process due to invalid data or server errors are handled gracefully and reported back to the client.`,
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
