const { schema } = require('./schemas/response/getInstanceFeedbackRest');
const {
  schema: xRequest,
} = require('./schemas/request/getInstanceFeedbackRest');

const openapi = {
  summary: 'Get feedback for a specific test instance',
  description: `This endpoint provides the mechanism to obtain feedback on a specific test instance. The feedback information can include scores, correct answers, comments, and any additional formative or evaluative information that may have been provided for that instance.

**Authentication:** User authentication is required to ensure that feedback is provided only to the relevant parties, typically the test taker or those with educational oversight.

**Permissions:** The user must have permissions to view feedback for the test instance. This generally implies they must either be the test taker or have a teaching, administrative, or evaluative role associated with the test.

The controller handling this request begins by validating the user's identity and permissions. It then proceeds to call the \`getInstanceFeedback\` service method from the \`tests\` core with the test instance identifier provided in the request. The service method retrieves the appropriate feedback data from the database, ensuring it's only accessible by users with the necessary permissions. Once fetched, the feedback data is formatted and sent back to the client as part of the HTTP response content.`,
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
