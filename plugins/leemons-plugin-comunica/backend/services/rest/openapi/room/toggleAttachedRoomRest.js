const { schema } = require('./schemas/response/toggleAttachedRoomRest');
const {
  schema: xRequest,
} = require('./schemas/request/toggleAttachedRoomRest');

const openapi = {
  summary: 'Toggle room attachment status',
  description: `This endpoint allows a user to change the attachment status of a specified room, effectively toggling its active association with other entities within the platform.

**Authentication:** Users are required to be authenticated to interact with this endpoint. Access will be denied if authentication credentials are not provided or are invalid.

**Permissions:** The user must possess adequate permissions to modify room attachment status. Without proper permissions, the user's request to toggle the room's attachment status will be rejected.

The controller initiates the process by handling an incoming request and extracting necessary identifiers, likely including the room's ID and the target state of the attachment (attached or detached). It then invokes the \`toggleAttachedRoom\` core method, which handles the business logic necessary to update the room's status. This may involve validating the current state of the room, checking the user's permissions, and applying the change in attachment status to the room within the system's database. The core logic ensures consistency and proper validation before any changes are made. On successfully toggling the attachment status, the method returns a confirmation message or status update, which the endpoint subsequently sends back to the client in the HTTP response.`,
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
