const { schema } = require('./schemas/response/getMessagesRest');
const { schema: xRequest } = require('./schemas/request/getMessagesRest');

const openapi = {
  summary: 'Fetches messages from a specific room',
  description: `This endpoint is responsible for retrieving a list of messages from a specified chat room. It is designed to enable users to view conversation history in the context of the room where the interaction took place.

**Authentication:** Users must be authenticated to request the list of messages. Unauthenticated requests will be rejected and lead to an error response.

**Permissions:** Users require 'read_messages' permission for the room they are attempting to fetch messages from. Without the appropriate permissions, the access to the message list will be denied.

Upon receiving a request, the \`getMessagesRest\` handler calls the \`getMessages\` method in the \`room\` core module, providing necessary details such as room identifier and user credentials. This core method performs validation checks, ensuring that the room exists and the requesting user agent has the required permissions. It then communicates with the underlying database to retrieve the messages, possibly involving decryption of content through the \`decrypt\` helper if messages are stored encrypted. The flow of execution might also include additional checks for user or room existence using the \`existUserAgent\` method. The final response includes a collection of message objects formatted as per the API specification and is returned to the user in a structured JSON format.`,
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
