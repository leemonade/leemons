const { schema } = require('./schemas/response/toggleAdminDisableRoomRest');
const {
  schema: xRequest,
} = require('./schemas/request/toggleAdminDisableRoomRest');

const openapi = {
  summary: 'Toggle administrative disablement of a specific room',
  description: `This endpoint allows administrators to toggle the disabled status of a specific room within the system. When a room is disabled, it is not accessible to users until it is re-enabled.

**Authentication:** Users must be authenticated and identified as administrators to access this function. Unauthorized access will be prevented, ensuring secure management of room statuses.

**Permissions:** The user must have the 'admin.room.toggleDisable' permission to execute this action. This ensures that only authorized personnel can alter the availability of rooms.

The handler initiates by calling the \`toggleDisableRoom\` method located within the room module's core logic. This method accepts a unique room identifier and checks the current state of the room. If the room is enabled, it will be disabled; if it is disabled, it will be enabled. This toggling is recorded in the system's audit trails for compliance and tracking purposes. The response signifies successful execution of the command and updates the current state of the room accordingly, all encapsulated within a transactional boundary to maintain data integrity.`,
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
