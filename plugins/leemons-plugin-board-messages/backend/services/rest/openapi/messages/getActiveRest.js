const { schema } = require('./schemas/response/getActiveRest');
const { schema: xRequest } = require('./schemas/request/getActiveRest');

const openapi = {
  summary: 'Fetch active board messages for the user',
  description: `This endpoint fetches the active messages from the user's board. It collects messages that are considered 'active' based on their current state, ensuring that the user sees relevant and timely information when they access their message board.

**Authentication:** Users are required to be authenticated in order to retrieve active board messages. An access check is performed to ensure the user's session is valid before proceeding to fetch messages.

**Permissions:** The appropriate permissions must be granted to the user for them to access board messages. This includes permissions to view messages on their designated board, which may vary depending on the user's role and access level within the application.

Upon receiving a request, the \`getActiveRest\` handler internally calls the \`getActive\` method from the \`messages\` core module, providing necessary user context and authorization details. The \`getActive\` function is responsible for querying the message board data, filtering out messages that are not active. This process involves checking against specific criteria such as message status and visibility settings. Once the active messages have been identified, the method returns them in an organized fashion for the \`getActiveRest\` handler to pass along as the HTTP response in a structured JSON format, completing the request-response cycle.`,
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
