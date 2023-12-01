const { schema } = require('./schemas/response/toggleMutedRoomRest');
const { schema: xRequest } = require('./schemas/request/toggleMutedRoomRest');

const openapi = {
  summary: 'Toggle muted status of a chat room',
  description: `This endpoint allows a user to toggle the muted status of a specified chat room, effectively enabling or disabling the user's notifications for messages received in that room.

**Authentication:** A user must be authenticated to change the mute settings for a chat room. The action will be rejected if the user's credentials are not provided or are invalid.

**Permissions:** The user needs to have the 'manage-room-settings' permission for the given chat room to toggle its mute status. Without the necessary permissions, the endpoint will deny access.

The endpoint begins by validating the presence of necessary parameters such as the \`roomId\` and the \`muteStatus\` intent. It calls the \`toggleMutedRoom\` method from the \`room\` core, passing the current user's context and the mute status. The method first checks if the user has the correct permissions and is a member of the room specified. If validation passes, it updates the mute settings for that user in the room. The method returns a confirmation of the updated status, which is then conveyed to the user through the API response in a JSON format.`,
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
