const { schema } = require('./schemas/response/assignTestRest');
const { schema: xRequest } = require('./schemas/request/assignTestRest');

const openapi = {
  summary: 'Assign a specific test to a group or individual users',
  description: `This endpoint assigns a specific test to either a group of users or individual users based on the criteria specified in the request. The assignment involves mapping a test instance to the specified users or groups, enabling them to access and complete the test within a set timeframe.

**Authentication:** Users need to be authenticated to perform this operation. Proper authentication ensures that only authorized users can assign tests.

**Permissions:** This endpoint requires the user to have administrative or teacher-level permissions, specifically the rights to manage and assign tests within the system.

Upon receiving the request, the \`assignTestRest\` handler first validates the user's authentication status and permissions. If the user is authenticated and has the necessary permissions, the handler proceeds to parse the input parameters which include the test ID and the identifiers for users or groups. The logic then interacts with the \`assignTest\` method in the backend's core test module, which handles the assignment logic, including the verification of test existence and user/group eligibility. The method updates the database entries to reflect the new assignments and returns a success response if the assignments are made successfully, or an appropriate error message otherwise.`,
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
