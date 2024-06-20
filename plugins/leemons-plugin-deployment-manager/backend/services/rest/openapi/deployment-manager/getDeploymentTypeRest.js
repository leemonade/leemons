const { schema } = require('./schemas/response/getDeploymentTypeRest');
const { schema: xRequest } = require('./schemas/request/getDeploymentTypeRest');

const openapi = {
  summary: 'Manage deployment type details',
  description: `This endpoint is responsible for handling the management of deployment type details within the deployment manager. It allows operations such as fetching, updating, or deleting deployment type information depending on the provided method and parameters.

**Authentication:** User authentication is required to access this endpoint. Requests without valid authentication will be denied, ensuring that only authorized users can manage deployment types.

**Permissions:** Users need to have specific permissions related to deployment management. Without the necessary permissions, the request will not be processed, and an access denial message will be returned.

The handler begins by determining the method of the request (GET, POST, PATCH, DELETE) to appropriately handle the operation regarding deployment types. It then calls a specific internal service method based on the request method, such as \`findDeploymentType\`, \`updateDeploymentType\`, or \`deleteDeploymentType\`. These service methods interact with the database to perform the required operation and return the result to the handler. The final response to the client includes the outcome of the operation, which could be the details of a deployment type, confirmation of an update, or a status of deletion, formatted as a JSON response.`,
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
