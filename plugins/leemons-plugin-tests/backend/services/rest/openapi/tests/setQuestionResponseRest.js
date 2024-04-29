const { schema } = require('./schemas/response/setQuestionResponseRest');
const {
  schema: xRequest,
} = require('./schemas/request/setQuestionResponseRest');

const openapi = {
  summary: 'Stores a user’s response to a specific test question',
  description: `This endpoint is responsible for recording a user's response to a given question in a test scenario. It ensures that the response is saved in the appropriate format and associated with the correct user and test instance.

**Authentication:** User authentication is required to ensure that responses are recorded for the correct user. An absence of valid authentication will prevent the endpoint from processing the request.

**Permissions:** Specific permissions related to test-taking capabilities are required for a user to submit their responses. The exact permissions should be defined based on the level of access the user has to the test and the type of questions they are allowed to answer.

Upon receiving a request, this endpoint invokes the \`setQuestionResponse\` method within the \`Tests\` service. This method processes the input, which includes the user's ID, the test ID, the question ID, and the user's response. The method verifies the validity of the data and checks against user permissions. Once validated, the response is stored in a database with the necessary metadata such as timestamp and user details. The process is designed to ensure data integrity and security, providing a reliable way for users to submit their test responses.`,
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
