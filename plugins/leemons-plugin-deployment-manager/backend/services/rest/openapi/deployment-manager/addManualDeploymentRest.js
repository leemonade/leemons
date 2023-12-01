const { schema } = require('./schemas/response/addManualDeploymentRest');
const {
  schema: xRequest,
} = require('./schemas/request/addManualDeploymentRest');

const openapi = {
  summary: 'Initiate a manual deployment process',
  description: `This endpoint initiates a manual deployment process for the given project and version. It is expected to trigger relevant scripts and perform necessary steps to deploy the selected version of the code to the appropriate environment.

**Authentication:** Users must be authenticated and hold valid session tokens to invoke this deployment process. Unauthenticated requests will be rejected.

**Permissions:** Users need to have 'deployment-manager' permissions to execute manual deployments. Lack of proper permissions will result in a \`403 Forbidden\` response.

Upon receiving a request, the \`addManualDeploymentRest\` action validates the user's session and permissions. If the validation is successful, it calls the underlying deployment service's 'addManualDeployment' method with the necessary parameters extracted from the request body. The method interacts with the deployment infrastructure and might utilize scripts or API calls to facilitate the deployment process. The response body includes the status of the deployment initiation, which could be in a queued, in-progress, or completed state depending on the immediate outcome of the request.`,
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
