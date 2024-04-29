const { schema } = require('./schemas/response/assignRest');
const { schema: xRequest } = require('./schemas/request/assignRest');

const openapi = {
  summary: 'Assign a learning module to a specific user or group',
  description: `This endpoint is responsible for assigning a learning module from the learning paths system to a user or a group of users. It allows administrators or authorized personnel to dynamically allocate educational content to different learners based on requirements or learning paths.

**Authentication:** User authentication is mandatory to access this endpoint. Users are required to provide a valid authentication token to prove their identity and access rights before making requests to this endpoint.

**Permissions:** Users need to have 'manage_learning_paths' permission to assign modules. Without the necessary permissions, the request will be rejected, ensuring that only authorized users can assign learning modules.

The controller starts by validating the user's authentication status and permissions. Upon successful validation, it invokes the \`assignModule\` function from the \`modules\` core logic. This function takes parameters such as module ID and user or group ID, and then interacts with the database to update the module assignments. The process involves checking the module's availability, the user's or group's eligibility, and then updating the assignment records in the database. The outcome of the operation is sent back to the user in the form of a success or error message, detailing the result of the assignment attempt.`,
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
