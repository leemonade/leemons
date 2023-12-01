const { schema } = require('./schemas/response/adminRemoveRoomRest');
const { schema: xRequest } = require('./schemas/request/adminRemoveRoomRest');

const openapi = {
  summary: 'Remove a specified room by admin.',
  description: `This endpoint allows an administrator to remove a specific room from the system. The room removal process ensures that the room and associated data are no longer accessible within the application.

**Authentication:** User must be authenticated and possess an administrative role to execute this operation. Unauthorized access is strictly prohibited and will be denied.

**Permissions:** The endpoint requires administrative privileges. A user without the necessary permissions attempting to invoke this action will receive an error response indicating insufficient permissions.

Upon receiving a request to the \`adminRemoveRoom\` handler, the system initiates a series of validations to ensure both the existence of the specified room and the necessary administrative permissions of the requesting user. It then calls the \`adminRemoveRoom\` method from the \`room\` core module, which orchestrates the deletion process. This process involves removing the room record from the database and performing any additional cleanup tasks, such as disconnecting users and archiving room-related communications. Once the operation is completed, a response confirming the successful deletion of the room is returned to the requester, along with any relevant metadata about the operation.`,
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
