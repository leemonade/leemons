const { schema } = require('./schemas/response/adminUpdateRoomNameRest');
const {
  schema: xRequest,
} = require('./schemas/request/adminUpdateRoomNameRest');

const openapi = {
  summary: 'Updates the name of a specific room',
  description: `This endpoint allows the administrator to update the name of an existing room in the platform. The update is applied to the room identified by a unique ID provided in the request parameters. This action involves changing the room's name in the database to a new value specified by the admin.

**Authentication:** User must be logged in as an administrator to perform this action. An invalid or missing authentication token will result in endpoint access denial.

**Permissions:** The user must have 'admin' role permissions to update room names. This ensures that only authorized personnel can make changes to critical data such as room identifications.

The process begins by the endpoint retrieving the room ID and the new name from the request. It then calls the \`adminUpdateRoomName\` function from \`room.index.js\`, passing the necessary parameters. This function checks for the room's existence using the \`exists\` validation method in \`exists.js\`, ensuring the operation doesn't occur on non-existent entities. Upon success, the new name is updated in the room's database entry. The entire transaction is handled safely to prevent data inconsistencies and unauthorized access, completing with a response that indicates the success of the operation.`,
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
