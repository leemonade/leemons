const { schema } = require('./schemas/response/assignTestRest');
const { schema: xRequest } = require('./schemas/request/assignTestRest');

const openapi = {
  summary: 'Assign a test to users or groups',
  description: `This endpoint is responsible for assigning a specific test to individual users or groups within the system. It handles the association of test instances with the respective target audience, ensuring that they have access to attempt the test within defined constraints, such as availability windows and attempt limits.

**Authentication:** User authentication is mandatory to assign tests. Only authenticated users with valid sessions can perform test assignments.

**Permissions:** This endpoint requires the user to have 'assign test' permissions. Users without the necessary permissions will be unable to assign tests to others.

Upon receiving a request to assign a test, the handler initially validates the user's authentication and authorization, ensuring they have the ability to assign tests. Then, the 'assignTest' method from the 'tests' core is called. This method takes the provided test ID, user or group IDs, and any additional assignment parameters to create a link between the test and the intended audience. It interacts with the underlying database to record the assignment details and assigns unique instance IDs for each test taker. Finally, the endpoint responds with either a success message and relevant assignment information or an error message indicating the failure of assignment operations.`,
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
