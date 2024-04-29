const { schema } = require('./schemas/response/getRoomListRest');
const { schema: xRequest } = require('./schemas/request/getRoomListRest');

const openapi = {
  summary: 'Lists all chat rooms associated with the current user',
  description: `This endpoint fetches a list of chat rooms that the current user is a part of. It ensures that the user can communicate with other participants in the system through the available chat rooms.

**Authentication:** Users need to be logged in to retrieve their list of chat rooms. Lack of authentication will prevent access to this endpoint.

**Permissions:** The user must have the 'view_chat_rooms' permission to access this information. Without this permission, the request will be rejected.

Upon receiving a request at this endpoint, the 'getRoomListRest' handler first verifies the user's authentication status and permissions. Upon validation, it calls the \`getUserAgentRoomsList\` method from the \`room\` core module. This method checks the user's ID against the room participants list stored in the database, collecting all the rooms where the user has an association. The method returns a list of room details, which includes the room name, ID, and other relevant metadata. Finally, the response is prepared and sent back to the user, detailing the rooms they are connected to, structured as a JSON array.`,
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
