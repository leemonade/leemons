const { schema } = require('./schemas/response/getUnreadMessagesRest');
const { schema: xRequest } = require('./schemas/request/getUnreadMessagesRest');

const openapi = {
  summary: 'Fetch unread messages for a specified chat room',
  description: `This endpoint fetches all unread messages from a specific chat room, aiming to update the current user on any messages they have not yet seen. The primary functionality is to enhance communication efficiency by ensuring users are abreast with all recent messages.

**Authentication:** Access to this endpoint requires that the user is authenticated. If authentication details are absent or incorrect, the request will not proceed.

**Permissions:** Users need to have adequate permissions to access chat room information. Typically, this includes permissions to view messages within a given room. Without these permissions, the request will be denied.

Upon receiving a request, this endpoint initiates by calling the \`getUnreadMessages\` method from the \`room\` core module. The method executes a query to filter out messages that have not been marked as read by the user, based on the user's ID and the room's ID. After retrieving these messages, they are conveyed back in a structured JSON format, encompassing details such as the sender, timestamp, and content of each unread message. This systematic retrieval is crucial for maintaining accurate and up-to-date dialogue threads within the application.`,
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
