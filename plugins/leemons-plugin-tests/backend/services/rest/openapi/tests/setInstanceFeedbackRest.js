const { schema } = require('./schemas/response/setInstanceFeedbackRest');
const {
  schema: xRequest,
} = require('./schemas/request/setInstanceFeedbackRest');

const openapi = {
  summary: 'Record user feedback for a test instance',
  description: `This endpoint captures and stores user feedback for a specific test instance. The feedback could include various types of information collected from the user regarding the test.

**Authentication:** This endpoint requires the user to be authenticated. Unauthorized requests will not be processed.

**Permissions:** Users must have specific permissions to submit feedback for a test instance. Ensure the user has the correct roles or permission flags to access this operation.

The handler begins by validating the provided feedback payload against a predefined schema. It proceeds to call the \`setInstanceFeedback\` method of the \`Tests\` service with the required parameters, typically including the user's identity and the test instance identifier along with the feedback content. The \`setInstanceFeedback\` method performs operations to persist the feedback in the database. Upon successful saving of feedback, the endpoint responds with a confirmation message indicating the operation's success. In case of any failure during the process, appropriate error messages and HTTP status codes are returned to the client.`,
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
