const { schema } = require('./schemas/response/listTestsRest');
const { schema: xRequest } = require('./schemas/request/listTestsRest');

const openapi = {
  summary: 'List all tests available to the user',
  description: `This endpoint retrieves all test configurations available to the currently authenticated user. The retrieved information includes details such as the test name, description, and associated subjects.

**Authentication:** Users need to be logged in to access this endpoint. An invalid or missing authentication token will result in access being denied.

**Permissions:** Users need to have 'view tests' permission to retrieve the list of available tests. If the user does not have the required permissions, access to the test data is denied.

The endpoint initializes by calling the \`listTests\` method from the \`Tests\` core service, which validates the user's credentials and permissions. If authentication and authorization are validated, the method queries the database for tests that the user is permitted to access based on the roles and permissions associated with their account. The data retrieved includes essential test details necessary for users to manage or partake in tests. Finally, the data is formatted and sent back to the user as a JSON response, containing an array of test objects.`,
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
