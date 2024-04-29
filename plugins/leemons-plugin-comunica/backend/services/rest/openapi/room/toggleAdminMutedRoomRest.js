const { schema } = require('./schemas/response/toggleAdminMutedRoomRest');
const {
  schema: xRequest,
} = require('./schemas/request/toggleAdminMutedRoomRest');

const openapi = {
  summary: 'Toggle admin mute status in a room',
  description: `This endpoint allows the toggling of the mute status for admins within a specified room. It is used to either mute or unmute admins based on the current status, effectively controlling their ability to participate audibly in room communications.

**Authentication:** User must be authenticated to modify admin mute settings in a room. Authentication ensures that only authorized users can affect the communication dynamics of the room.

**Permissions:** This endpoint requires the user to have administrative rights within the room or platform. The permission to toggle mute settings is crucial to maintain control over the room's communication environment.

Upon receiving a request, the endpoint initially checks for user authentication and confirms that the required permissions are met. It then proceeds to call the \`toggleAdminMutedRoom\` method from the core room functionality. This method checks the current mute status of the admin in the specified room and toggles it. Depending on the current state, if the admin is muted, they will be unmuted and vice versa. This operation involves updating room settings in the database and reflects changes immediately in the room’s communication flow. The result of this operation is a confirmation of the new mute status, which is sent back to the requester in the response payload.`,
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
