const { schema } = require('./schemas/response/getUserQuestionResponsesRest');
const {
  schema: xRequest,
} = require('./schemas/request/getUserQuestionResponsesRest');

const openapi = {
  summary: 'Fetches user-specific question responses',
  description: `This endpoint fetches responses to questions that have been submitted by a specific user in the system. It aggregates responses across different assessments or tests where the user participated, providing a comprehensive view of the user's interactions and answers.

**Authentication:** User authentication is strictly required to access this endpoint. Users must provide a valid authentication token which is verified for integrity and validity before processing the request.

**Permissions:** This endpoint requires the user to have specific permissions related to viewing test responses. Typically, permissions such as \`view_tests\` or \`view_user_responses\` are checked to ensure authorized access.

Upon receiving a request, the handler first validates the user's authentication status and permissions. If either check fails, an error response is returned. Otherwise, it proceeds to invoke the \`getUserQuestionResponses\` method from the tests core logic. This method compiles data related to the user's question responses by querying the database for entries that match the user's ID across various tests. The resulting data set, formatted as JSON, details the questions, their corresponding responses made by the user, and contextual details like the date of the test and the labels associated with each question. The response is then structured and sent back to the user, providing a clear and detailed overview of their test interactions.`,
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
