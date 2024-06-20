const { schema } = require('./schemas/response/sendMessageRest');
const { schema: xRequest } = require('./schemas/request/sendMessageRest');

const openapi = {
  summary: 'Send a message to a specified room',
  description: `This endpoint allows a user to send a message to a specified room in the communication platform. The operation includes validating the user's rights to post in the room, checking the message content for compliance with platform policies, and storing the message in the database for retrieval by room members.

**Authentication:** The user must be authenticated to send messages. A valid authentication token is required to process the message sending request.

**Permissions:** Users need to have appropriate permissions to post messages in the specified room. This usually includes being a member of the room or having special privileges as a moderator or admin.

The process starts by validating the user's authentication token to ensure it is active and valid. Once authenticated, the \`sendMessage\` method is invoked with parameters including the user ID and room ID alongside the message content. The handler conducts a permissions check to ascertain if the user has the right to post in the room. Following permissions validation, the message content is processed to ensure it adheres to message standards and policies before being stored in the room's database. Finally, a confirmation of message delivery is sent back to the user along with any potential errors encountered during the message submission process.`,
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
