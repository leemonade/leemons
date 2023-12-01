const { schema } = require('./schemas/response/toggleAdminMutedRoomRest');
const {
  schema: xRequest,
} = require('./schemas/request/toggleAdminMutedRoomRest');

const openapi = {
  summary: 'Toggle admin mute status in a room',
  description: `This endpoint allows toggling the mute status of an admin within a specified room. It is used to either mute or unmute an admin, affecting their ability to communicate in the room.

**Authentication:** Users must be authenticated to change the mute status of an admin in a room. An authentication token is required, and the action will be rejected if the user is not logged in or if the token is invalid.

**Permissions:** The user needs to have administrative privileges to toggle the mute status of another admin in the room. The endpoint will verify that the requesting user has the appropriate rights before processing the request.

Upon receiving the request, the \`toggleAdminMutedRoomRest\` handler initiates the process by calling the \`toggleAdminMutedRoom\` method, which resides in \`room/index.js\`. This method checks the existence of the room and the user agent's authorization using the \`existUserAgent\` validation from \`validations/exists.js\`. If the validation is successful, it performs the action to change the mute status through the \`toggleAdminMutedRoom\` function, located in \`room/toggleAdminMutedRoom.js\`. The function executes database updates to reflect the new mute status. Upon successful completion, the endpoint responds with a confirmation of the mute status change.`,
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
