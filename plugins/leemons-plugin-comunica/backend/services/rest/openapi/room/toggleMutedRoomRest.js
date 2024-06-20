const { schema } = require('./schemas/response/toggleMutedRoomRest');
const { schema: xRequest } = require('./schemas/request/toggleMutedRoomRest');

const openapi = {
  summary: 'Toggle muting state of a specified room',
  description: `This endpoint toggles the muting state of a room specified by its ID. When triggered, it alternates the room's current mute status—either muting or unmuting it depending on the existing state.

**Authentication:** Users need to be authenticated to toggle the mute status of a room. The system verifies user credentials and session validity before processing the request.

**Permissions:** The user must have administrative rights or specific permissions to modify the muting state of a room to ensure secure and authorized access.

The process begins with the REST layer receiving a toggle request, which is then forwarded to the \`toggleMutedRoom\` method in the room core module. This method checks the current state of the room's mute status and switches it. The updated state is persisted in the database ensuring that the changes are stored consistently. A response is then generated to signify the successful toggling of the room's mute status, providing confirmation back to the user.`,
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
