const { schema } = require('./schemas/response/getUnreadMessagesRest');
const { schema: xRequest } = require('./schemas/request/getUnreadMessagesRest');

const openapi = {
  summary: 'Fetch unread messages for a specific room',
  description: `This endpoint is responsible for retrieving all unread messages in a given room for the authenticated user. It ensures users are kept up to date with new communications in their conversations.

**Authentication:** Users must be authenticated to fetch their unread messages. Unauthenticated requests will be rejected with an appropriate error message.

**Permissions:** The user needs to have access permissions to the specific room from which unread messages are being requested. If the user does not have permission, the request will be denied.

Upon receiving a request, the \`getUnreadMessagesRest\` handler calls the \`getUnreadMessages\` method located in the \`room\` core. This method accepts the \`roomID\`, identified through the route parameters, and the authenticated \`userID\`, extracted from the user session or token. The core method performs a query on the database to find all messages marked as unread for the user in the specified room. It then compiles these messages into a list, which is returned to the handler. Finally, the handler responds with a JSON payload containing the unread messages, thus allowing the front-end application to update the user's view accordingly.`,
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
