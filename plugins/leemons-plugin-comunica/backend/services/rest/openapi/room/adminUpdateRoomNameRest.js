const { schema } = require('./schemas/response/adminUpdateRoomNameRest');
const {
  schema: xRequest,
} = require('./schemas/request/adminUpdateRoomNameRest');

const openapi = {
  summary: 'Updates the name of an existing communication room',
  description: `This endpoint allows an admin to update the name of a communication room within the platform. By providing the necessary information, the name of an existing room can be changed as required, reflecting any updates in real-time across the system.

**Authentication:** The user must be authenticated and recognized as an administrator to perform this action. Unauthorized access will be denied, ensuring that only authorized personnel can modify room names.

**Permissions:** Adequate permissions are required for a user to update room names. This typically includes administrative rights or specific role-based permissions allowing the alteration of communication room settings.

Upon receiving the request with the new room name and the identifier of the room to be updated, the endpoint calls the \`adminUpdateRoomName\` method located in the \`leemons-plugin-comunica/backend/core/room\` directory. This method validates the existence of the room and user permissions before proceeding to update the room name in the persistent storage, typically a database. It is important that both the room exists and the user has proper authorization to carry out this operation. Once the update is successful, the method responds with a success message or a detailed error message in case of failure. The entire process ensures atomicity and data consistency across the platform.`,
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
