const { schema } = require('./schemas/response/adminChangeRoomImageRest');
const {
  schema: xRequest,
} = require('./schemas/request/adminChangeRoomImageRest');

const openapi = {
  summary: 'Change room image by admin',
  description: `This endpoint allows administrators to change the image of a specific room within the system. The new image is meant to visually represent or update the room's appearance in user interfaces.

**Authentication:** This endpoint requires users to be authenticated as administrators. An administrator role is essential to carry out this action, and access will be denied if proper authentication is not provided.

**Permissions:** Users must have administrative rights to update room images. The action is restricted to ensure that only users with the appropriate level of access can make changes to the visual assets of a room.

Upon receiving the request, the \`adminChangeRoomImageRest\` handler initiates a flow where it first verifies the authenticity and permissions of the requesting user. It then calls the \`adminChangeRoomImage\` method from the room core, passing necessary parameters such as the room ID and the new image data. This method handles the validation of the room's existence, checks the user's access rights, and proceeds to update the room's image in the database. Once the update is successful, the endpoint responds with a confirmation of the change. If the process encounters any issues, such as authentication failure, lack of permissions, or data validation errors, the endpoint will return an appropriate error message with details regarding the failure.`,
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
