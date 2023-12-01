const { schema } = require('./schemas/response/getTestRest');
const { schema: xRequest } = require('./schemas/request/getTestRest');

const openapi = {
  summary: 'Retrieve tests associated with the requesting user',
  description: `This endpoint retrieves a collection of test instances that are associated with the user making the request. This includes tests that the user is eligible to take, as well as those they have created, if applicable.

**Authentication:** User authentication is necessary to access the test information. Only authenticated users can retrieve their associated tests.

**Permissions:** The user must have permissions to view the tests. Certain tests may be restricted based on the user's role or permissions within the application.

Upon receiving the request, the handler function within \`tests.rest.js\` invokes a service action, typically called \`listTests\`, which handles the logic for retrieving the tests. This service action interacts with the underlying database or test management system to gather all tests associated with the user's identity or role. The retrieval process respects access controls and only returns the tests the user is authorized to view. The results, which include details like test names, descriptions, and availability, are then formatted into a JSON response and sent back to the user.`,
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
