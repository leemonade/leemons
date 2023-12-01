const { schema } = require('./schemas/response/findOneRest');
const { schema: xRequest } = require('./schemas/request/findOneRest');

const openapi = {
  summary: 'Find a specific task settings record',
  description: `This endpoint retrieves a single task settings record based on a provided unique identifier. It is meant to return the configuration details for a particular task within the system.

**Authentication:** User authentication is required to ensure secure access to task settings. Users must be logged in and have a valid session to proceed with this request.

**Permissions:** Users need to have the 'view_task_settings' permission to fetch the settings of a task. Without this permission, the endpoint will deny access.

Upon receiving a request, the \`findOneRest\` handler calls the \`findOne\` core method, providing it with necessary query parameters to uniquely identify a task settings record. The core method interacts with the underlying database using a model to retrieve the settings. If successful, it returns the settings object back to the \`findOneRest\` action handler, which then formats these details into a JSON response for the client. This process involves verifying the user's authentication status and permissions, error handling for non-existent records or unauthorized access, and the serialization of the resulting data.`,
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
