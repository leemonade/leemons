const { schema } = require('./schemas/response/toggleAdminDisableRoomRest');
const {
  schema: xRequest,
} = require('./schemas/request/toggleAdminDisableRoomRest');

const openapi = {
  summary: 'Toggle the disabled status of a room for an administrator',
  description: `This endpoint toggles the disabled status of a specific room within the platform, allowing administrators to enable or disable a room as needed.

**Authentication:** Administrators must be authenticated to modify the status of rooms. Unauthorized users will be prevented from accessing this functionality.

**Permissions:** The user must have administrative privileges to disable or enable rooms. Lack of adequate permissions will result in an access denial to this endpoint.

The endpoint initializes by calling the \`toggleAdminDisableRoomRest\` method. This action triggers a series of checks and balances that first validate the existence of the specified room using methods like \`existRoom\` within the \`room\` core, ensuring it can be modified. Subsequently, the \`toggleDisableRoom\` method from the same core is invoked, which flips the room's disabled status. If a room is disabled, it becomes inaccessible for users until re-enabled by an administrator. On successful execution, the endpoint returns a response confirming the updated status of the room.`,
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
