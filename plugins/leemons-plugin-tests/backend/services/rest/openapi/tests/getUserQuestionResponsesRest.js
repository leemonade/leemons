const { schema } = require('./schemas/response/getUserQuestionResponsesRest');
const {
  schema: xRequest,
} = require('./schemas/request/getUserQuestionResponsesRest');

const openapi = {
  summary: "Fetch user's test question responses",
  description: `This endpoint is designed to retrieve all the responses that a specific user has given to test questions within the platform. It allows the retrieval of the user's input across various assessments to monitor progress or performance.

**Authentication:** Users are required to be authenticated to retrieve their question responses. Unauthenticated access will lead to a rejection of the request.

**Permissions:** Specific permissions may be enforced to ensure that users can only access their own question responses unless explicitly granted rights to view others' responses.

Upon receiving the request, the \`getUserQuestionResponsesRest\` handler first validates the user's authentication status to ensure that they have the right to access the information. It then calls the \`getUserQuestionResponses\` method from the core \`tests\` module, which gathers the user's responses from the database. The process involves querying the test questions and matching them with the user's submitted responses based on unique identifiers. After the data is fetched and compiled, it is returned to the requestor in a structured JSON format, encapsulating the user's responses to the questions they have tackled.`,
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
