const { schema } = require('./schemas/response/setQuestionResponseRest');
const {
  schema: xRequest,
} = require('./schemas/request/setQuestionResponseRest');

const openapi = {
  summary: "Records a user's response to a test question",
  description: `This endpoint allows for the recording of a user's response to a specific question within a test instance. The stored response data can later be used for evaluation and analytics purposes.

**Authentication:** Users must be authenticated to submit their responses. Non-authenticated submissions will be rejected.

**Permissions:** Users need to have the 'submit_response' permission for the test instance they are trying to submit to. Without this permission, the endpoint will deny submission.

Upon receiving a request, the \`setQuestionResponse\` action is called with necessary parameters such as the user's ID, test instance ID, and their response to the question. The method validates the user's permissions and whether the test instance accepts responses. It then records the user's response using the \`setQuestionResponse\` function from the \`tests\` core logic. If successful, the response is saved to the database, and a success message is returned. If there is an issue with the submission, such as invalid permissions or an incorrect test instance ID, an error message detailing the issue is returned to the user.`,
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
