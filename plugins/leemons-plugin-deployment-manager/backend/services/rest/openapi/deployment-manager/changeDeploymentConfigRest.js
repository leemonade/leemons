const { schema } = require('./schemas/response/changeDeploymentConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/changeDeploymentConfigRest');

const openapi = {
  summary: 'Updates deployment configuration for a specific project',
  description: `This endpoint updates the deployment configuration for a given project within the system. It allows for modifications of settings and parameters that determine how deployments are handled for that project.

**Authentication:** Users must be authenticated to modify deployment configurations. Authentication ensures that requests are made by legitimate users of the application.

**Permissions:** Users need specific permissions related to deployment management. Typically, this includes administrative rights or specific role-based permissions that allow a user to modify deployment settings.

The endpoint processes the incoming request by first validating the user's credentials and permissions. If authentication or permission checks fail, the request is denied. Upon successful validation, the endpoint invokes the \`updateDeploymentConfig\` method from the \`deployments\` core. This method is responsible for updating the deployment configuration based on the provided parameters in the request body. It handles various checks and balances to ensure that the new configuration does not conflict with existing deployment rules and standards. Once updated, the function confirms the changes and responds back with a status indicating the successful update of the deployment configuration.`,
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
