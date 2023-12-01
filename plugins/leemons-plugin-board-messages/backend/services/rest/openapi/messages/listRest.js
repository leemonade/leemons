const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List board messages for users',
  description: `This endpoint lists all board messages available to a user, filtered and sorted according to the provided criteria. The messages could include announcements, updates, or any other board-related communications that the user is eligible to view within the application.

**Authentication:** Users are required to be authenticated to access their board messages. The endpoint enforces authentication checks and will reject requests from unauthenticated users.

**Permissions:** Sufficient privileges are necessary to access messages. Users need to have 'view_messages' permission to retrieve the list of board messages. Lack of adequate permissions will result in access being denied.

When a request is received, the endpoint initially validates the user's session and permissions through middleware. Once verified, it invokes the \`list\` action in \`messages.core\`, which then delegates to the \`list.js\` logic. This involves querying the database with filters such as date ranges, message types, and user-specific criteria using the \`getMessageIdsByFilters.js\` method. It compiles a set of message identifiers that match the applied filters. Subsequently, the \`byIds.js\` function retrieves the full message data for these identifiers, effectively returning the final list of messages to the user. The successful outcome of this process concludes with the HTTP response delivering a structured JSON containing the list of board messages.`,
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
