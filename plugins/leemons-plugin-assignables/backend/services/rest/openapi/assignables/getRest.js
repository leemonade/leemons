const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Manage assignable items in the system',
  description: `This endpoint is responsible for managing assignable items such as tasks, homework, projects, etc., in the educational platform. It allows for creating, retrieving, updating, or deleting information related to assignables depending on the provided method and parameters.

**Authentication:** User authentication is required to interact with this endpoint. Users must provide a valid session token that the system verifies before granting access to the assignable resources.

**Permissions:** Users need specific permissions related to the assignables they are trying to interact with. Typically, permissions like 'assignable.view', 'assignable.edit', and 'assignable.delete' might be checked depending on the action requested.

Upon receiving a request, the endpoint first checks the user's authentication status and permissions. If the user is authenticated and has the necessary permissions, the respective action is performed by calling the appropriate service method within the \`assignables\` plugin's backend. These methods interact with the database to fetch, update, or delete the assignable data as requested. Detailed logs are maintained for auditing and troubleshooting. The response from the action is then prepared and sent back to the client, detailing the outcome of their request or providing the requested data.`,
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
