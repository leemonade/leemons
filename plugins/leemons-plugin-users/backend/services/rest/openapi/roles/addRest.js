const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add role information into the system',
  description: `This endpoint allows for the addition of new role data into the system. It specifically handles the creation of roles along with their respective permissions and associated details within the user management module of the platform.

**Authentication:** Users must be logged in to create new roles. This endpoint requires a valid authentication token, which should be included in the request headers.

**Permissions:** Users need to have 'create_role' permission to access this endpoint. Without this permission, the endpoint will deny the request, ensuring that only authorized users can add new roles.

Upon receiving a request, the \`add\` action in the roles management service is called. The service first checks for the necessary permissions against the user's role. If validated, it processes the provided data to ensure it meets the format and validation standards set by the platform. Once the data is validated, it interacts with the underlying database to insert the new role record. A response is then generated based on the outcome of the database operation - success if the role is added correctly, or an error message detailing any issues encountered during the process.`,
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
