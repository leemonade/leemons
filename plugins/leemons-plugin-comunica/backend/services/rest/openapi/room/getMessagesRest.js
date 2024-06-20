const { schema } = require('./schemas/response/getMessagesRest');
const { schema: xRequest } = require('./schemas/request/getMessagesRest');

const openapi = {
  summary: 'Fetches all messages for a specific room',
  description: `This endpoint retrieves all the messages associated with a specified chat room. It helps in displaying conversation history to the user based on the room they select or are actively participating in.

**Authentication:** Users must be logged in to fetch messages from a chat room. If the authentication details are not provided or are invalid, the request will be denied.

**Permissions:** Users need to have the appropriate permissions to view the messages in a chat room. These permissions ensure that only participants of the chat room or specific roles authorized by the application's access control can retrieve the conversation history.

The getMessagesRest handler initiates the process by invoking the \`getMessages\` function from the \`room\` core module. The function requires the room's unique identifier, which is extracted from the request parameters. Upon receiving the request, the function checks the room's existence and the user's access level. It then proceeds to fetch all relevant messages using a decrypted method of data retrieval to ensure security and privacy of the communication. Each message is processed to conform to the format necessary for client-side rendering before being returned as a list in the response.`,
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
