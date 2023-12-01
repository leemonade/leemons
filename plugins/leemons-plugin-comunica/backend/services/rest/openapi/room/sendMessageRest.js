const { schema } = require('./schemas/response/sendMessageRest');
const { schema: xRequest } = require('./schemas/request/sendMessageRest');

const openapi = {
  summary: 'Sends a message to a specified room',
  description: `This endpoint allows for sending a message to a specific room within the communication platform. It takes the message content along with target room information and dispatches the message to all subscribed users of that room.

**Authentication:** Users need to be authenticated to send messages. Sending messages while unauthenticated will result in an error.

**Permissions:** Users must have 'send_message' permission for the target room. Without the necessary permissions, the message will not be sent, and an error will be returned.

Upon receiving the message sending request, the \`sendMessageRest\` handler initiates the process by validating the user's authentication status and verifying if they have the required permissions for the room. If validated, it then calls the \`sendMessage\` method from the \`room\` core with the necessary parameters, including the sender's information and message content. The \`sendMessage\` function handles the logic of delivering the message to all active participants of the room, ensuring the delivery is acknowledged by the system. Upon successful message dispatch, a confirmation response is sent back to the sender, while any errors encountered during the process are reported accordingly.`,
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
