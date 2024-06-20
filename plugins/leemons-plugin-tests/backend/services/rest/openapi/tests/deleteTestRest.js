const { schema } = require('./schemas/response/deleteTestRest');
const { schema: xRequest } = require('./schemas/request/deleteTestRest');

const openapi = {
  summary: 'Deletes a specific test',
  description: `This endpoint allows for the deletion of a specific test identified by its unique ID. The deletion process permanently removes the test from the system, including all associated data.

**Authentication:** User authentication is required to ensure that only authorized users can delete tests. A verification process checks whether the provided user credentials match with an existing user session.

**Permissions:** The user must have 'delete_tests' permission to execute this action. If the user lacks this permission, the request is denied with an appropriate error message.

Upon receiving the delete request, the \`deleteTest\` action in the \`tests.rest.js\` file gets triggered. This action starts by verifying the user's authentication status and permissions. If authentication or permissions checks fail, it immediately returns a response indicating the lack of authorization. If checks pass, the action calls the \`deleteTestById\` method from the \`tests\` core module. This method executes a database query to remove the test based on the provided ID. The completion of this operation models the final response where the success or failure of the deletion is communicated back to the client.`,
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
