const { schema } = require('./schemas/response/adminRemoveRoomRest');
const { schema: xRequest } = require('./schemas/request/adminRemoveRoomRest');

const openapi = {
  summary: 'Remove a room from the system by an admin',
  description: `This endpoint allows administrative users to remove a specific room from the system. The action ensures that only authorized administrative personnel can manage and remove rooms, maintaining system integrity and access control.

**Authentication:** Users must be authenticated and identified as administrators to perform this action. Any attempt to access this endpoint without proper authentication or administrative rights will be denied.

**Permissions:** The user executing this endpoint must have administrative permissions specifically granted for managing and removing rooms. Access without adequate permissions will result in a failure to execute the desired operation.

Upon receiving a request, the \`adminRemoveRoomRest\` handler first checks the authentication and permissions of the user trying to access the endpoint. If the user is authenticated and has the necessary permissions, it proceeds to call the \`adminRemoveRoom\` method from the \`room\` core. This method involves validating the existence of the room and ensuring that no constraints are violated by its removal. Once validation is successful, the room is removed from the system database, and a confirmation response is sent back to the requestor indicating successful deletion.`,
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
