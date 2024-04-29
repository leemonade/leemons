const { schema } = require('./schemas/response/deploymentInfoRest');
const { schema: xRequest } = require('./schemas/request/deploymentInfoRest');

const openapi = {
  summary: 'Fetches detailed information about a specific deployment',
  description: `This endpoint retrieves detailed information about a deployment specified by the user. The information includes all relevant details such as configuration, version, status, etc., focusing on providing a comprehensive view of the deployment's current state.

**Authentication:** This endpoint requires users to be authenticated. Users attempting to access deployment details without a valid authentication token will be denied.

**Permissions:** Users need to have the 'view_deployment' permission to access this endpoint. This ensures that only authorized personnel can view sensitive deployment information.

The handler initiates by calling the \`getDeploymentInfo\` method from the deployment manager's core module. This method takes a deployment identifier from the request parameters and performs a query against the deployment database to retrieve all corresponding details. The process involves checking the user's permissions and the validity of the provided deployment ID. Once the data is fetched and verified, it culminates in the formation of a JSON object that includes the complete set of deployment details, which is then returned to the user.`,
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
