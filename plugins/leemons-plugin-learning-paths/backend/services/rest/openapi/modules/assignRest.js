const { schema } = require('./schemas/response/assignRest');
const { schema: xRequest } = require('./schemas/request/assignRest');

const openapi = {
  summary: 'Assigns a learning module to users or groups',
  description: `This endpoint is responsible for assigning a specific learning module to a set of users or user groups within the educational platform. It facilitates the targeted delivery of learning content based on the academic or training requirements.

**Authentication:** Users must be authenticated to assign modules to users or groups. The system will reject requests without valid authentication credentials.

**Permissions:** Users need to have the 'manage_learning_paths' permission to assign modules. Without this permission, the request will be denied, ensuring that only authorized personnel can make such assignments.

Upon receiving the request, the \`assignModule\` action is called with appropriate parameters such as module ID and assigned users or groups. Internally, this action performs checks to verify that the requesting user has the necessary permissions and authentication to perform such an operation. It interacts with several core components, including the underlying database, to update module assignments. The process involves creating or updating records that map the learning module to the specified users or groups, effectively updating the course structure for the involved parties. The response from this action confirms the successful assignment or provides error messages detailing any issues encountered during the process.`,
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
