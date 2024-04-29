const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List all board messages accessible to the current user',
  description: `This endpoint enables the retrieval of all board messages that the current user has permissions to access. It is designed to facilitate communication within groups or boards by displaying relevant messages.

**Authentication:** Users need to be authenticated to view the messages. This ensures that only authorized users can access sensitive or private communications within their groups or boards.

**Permissions:** The user must have the appropriate permissions to view messages in specific boards. Access will be denied if the user does not have the necessary rights to the board or group messages they are attempting to access.

Upon receiving a request, the endpoint initially calls the \`list\` method from the \`messages\` core, which invokes the \`getMessageIdsByFilters\` method to filter message IDs based on user permissions and other applied filters. Subsequently, \`byIds\` aggregates these IDs to retrieve detailed message data. The flow completes with the assembly of all relevant message information into a consumable format for the client, effectively responding with a structured list of messages available to the user under the established permissions.`,
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
