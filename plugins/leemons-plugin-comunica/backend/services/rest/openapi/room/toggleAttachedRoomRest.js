const { schema } = require('./schemas/response/toggleAttachedRoomRest');
const {
  schema: xRequest,
} = require('./schemas/request/toggleAttachedRoomRest');

const openapi = {
  summary: 'Toggle the attachment status of a room',
  description: `This endpoint enables the toggling of a room's attachment status in the system. It is used primarily to change the state of a room between being attached or detached from a particular user or entity session.

**Authentication:** Users need to be authenticated to perform this action. Access will be denied for unauthorized requests.

**Permissions:** The user must have administrative rights or specific permissions related to room management to execute this operation.

The process begins with the controller retrieving the room ID and the target attachment state from the request body. It then calls the \`toggleAttachedRoom\` method from the \`room\` core service. This method checks the existing state of the room and toggles it accordingly, ensuring that all data integrity and state dependencies are handled correctly. The outcome of this operation (success or failure) is then returned to the user as part of the HTTP response, detailing whether the toggle was successful and the current state of the room.`,
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
