const { schema } = require('./schemas/response/listTestsRest');
const { schema: xRequest } = require('./schemas/request/listTestsRest');

const openapi = {
  summary: 'List all test configurations available',
  description: `This endpoint is responsible for fetching a collection of all test configurations available within the system. The list could include various types of assessments, quizzes, or standardized tests that users can undertake or administer.

**Authentication:** User authentication is required for accessing the list of test configurations. Without proper authentication, the endpoint will not provide any data.

**Permissions:** Specific permissions are necessary to interact with this endpoint. Users must have the right to view or manage test configurations, which typically involves permission checks against roles or specific access rights within the application.

Upon receiving a request, the \`listTestsRest\` handler in the \`tests.rest.js\` file calls the \`listTests\` action, passing required query parameters received from the user's request, if any. Internally, the \`listTests\` action communicates with the database to query for all test configurations that match the user's permissions and filters. The results are then processed and returned to the user in a structured format, often as an array of test configuration objects in the response payload.`,
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
