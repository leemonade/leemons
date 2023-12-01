const { schema } = require('./schemas/response/markMessagesAsReadRest');
const {
  schema: xRequest,
} = require('./schemas/request/markMessagesAsReadRest');

const openapi = {
  summary: 'Marks specified messages in a room as read',
  description: `This endpoint marks a collection of messages within a room as read for the currently authenticated user. It primarily updates the read status of messages, ensuring the user's message list reflects the most recent interactions.

**Authentication:** Users must be logged in to mark messages as read. An authenticating token is required to validate the user's session and apply the changes to the correct account.

**Permissions:** The user should have read access to the room whose messages are being marked as read. Without the proper permissions, the operation will be denied, and the messages will retain their unread status.

Upon receiving a request, the \`markMessagesAsReadRest\` handler first verifies the authentication and permissions of the user. It then retrieves the list of message IDs from the request body. The handler calls the \`markAsRead\` method from the \`room\` core module. This method checks that each message exists, belongs to the room, and has not already been marked as read by the user. For valid messages, it updates their read status in the database and returns confirmation of the actions taken. The endpoint responds with a success status and a list of messages that were successfully marked as read, alongside any errors encountered during the process.`,
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
