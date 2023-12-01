const { schema } = require('./schemas/response/saveRest');
const { schema: xRequest } = require('./schemas/request/saveRest');

const openapi = {
  summary: 'Save a new message to the board',
  description: `This endpoint saves a new message to the message board. It handles the creation and storage of messages that users intend to post on the platform's message board. The endpoint ensures that all messages comply with the required data structure and business logic before persisting them.

**Authentication:** Users must be authenticated to post messages. A valid session or authentication token is checked prior to message acceptance.

**Permissions:** The user needs to have 'message:post' permissions to create messages. Without the appropriate permission, the endpoint will reject the message creation request.

Upon receiving a request to save a message, the \`saveRest\` handler calls the \`save\` method from the \`messages\` core module. This method validates the provided message data against predefined schema and checks for any overlaps with other existing message configurations using \`getOverlapsWithOtherConfigurations\`. When cleared, it further processes any required filters using \`getMessageIdsByFilters\`, calculates message status from dates using \`calculeStatusFromDates\`, and finally persists the message through to the data store. In case of success, it returns the saved message's details in the HTTP response.`,
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
