const { schema } = require('./schemas/response/adminChangeRoomImageRest');
const {
  schema: xRequest,
} = require('./schemas/request/adminChangeRoomImageRest');

const openapi = {
  summary: 'Change room image by admin',
  description: `This endpoint allows an administrator to update the image associated with a specific room within the platform. The administrator can upload a new image file that will replace the existing room image.

**Authentication:** User authentication is required to ensure that the request is made by a verified admin account. An invalid or missing token will restrict access to this endpoint.

**Permissions:** This operation requires administrative permissions specifically tailored for room management. The user needs to have the 'admin:changeRoomImage' permission to execute this action, ensuring that only authorized personnel can modify room images.

From an implementation perspective, this endpoint initially validates the provided inputs using dedicated validation methods. Once validation is passed, it invokes the \`adminChangeRoomImage\` function of the 'Room' core module. This function handles the logic for the image update, including file verification, deletion of the old image, and updating the room's image data in the database. The response will either be a success message confirming the image update or an error message detailing any issues encountered during the process.`,
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
