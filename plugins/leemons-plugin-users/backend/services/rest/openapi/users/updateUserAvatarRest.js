const { schema } = require('./schemas/response/updateUserAvatarRest');
const { schema: xRequest } = require('./schemas/request/updateUserAvatarRest');

const openapi = {
  summary: "Update user's avatar image",
  description: `This endpoint allows for the update of the user's profile avatar image. An authenticated user can upload a new avatar to personalize their profile on the platform.

**Authentication:** This action requires the user to be authenticated, meaning a valid session must be established prior to making the request.

**Permissions:** The user must have the appropriate permissions to update their own avatar. Typically, this means the user can only update the avatar associated with their own profile and not others.

Upon receiving the request, the handler validates the provided input for the new avatar image, ensuring it meets any platform-specific requirements for size, format, or dimensions. It then invokes the \`updateAvatar\` method, which takes care of storing the new avatar image appropriately; this could involve interactions with file storage services. Additional steps might include updating user-related records in the database to reflect the new avatar path. On successfully updating the avatar, the endpoint responds to the client confirming the update. If any errors occur during the process, appropriate error messages are returned in the response, informing the client of the failure and its cause.`,
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
