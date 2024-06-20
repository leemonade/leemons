const { schema } = require('./schemas/response/markMessagesAsReadRest');
const {
  schema: xRequest,
} = require('./schemas/request/markMessagesAsReadRest');

const openapi = {
  summary: 'Marks specified messages as read by the user',
  description: `This endpoint marks one or more messages as read for a user within a specified communication room. Once marked, messages will not appear as unread in the user interface of the communication tool.

**Authentication:** User authentication is required to access and modify the read status of messages. Only authenticated users can mark messages as read, ensuring that the action is securely attributed to the correct user account.

**Permissions:** Users must have read access to the room in which the messages were sent to mark them as read. The endpoint verifies user permissions to ensure they are authorized to modify message statuses within the room.

The flow begins in the \`markMessagesAsReadRest\` action handler in \`room.rest.js\`, which delegates to the \`markAsRead\` method in \`room/index.js\`. This method processes the list of message IDs provided in the request, checking each message for the user's access rights. It uses the \`exists.js\` validation to ensure the messages exist before proceeding. Once all permissions and existence checks are satisfied, the method updates the read status of the messages in the database. The response then confirms the successful update of the message statuses to the client.`,
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
