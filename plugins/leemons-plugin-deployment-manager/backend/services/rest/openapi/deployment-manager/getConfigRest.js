const { schema } = require('./schemas/response/getConfigRest');
const { schema: xRequest } = require('./schemas/request/getConfigRest');

const openapi = {
  summary: 'Fetch deployment configuration details',
  description: `This endpoint retrieves the configuration details associated with a specific deployment. This encompasses fetching relevant configuration items such as environment settings, deployment scripts, and associated metadata that define how a deployment should be conducted within the system.

**Authentication:** Users are required to be authenticated to ensure secure access to deployment configuration details. Authentication mechanisms must validate the user’s identity before allowing access to this endpoint.

**Permissions:** Appropriate permissions must be verified before a user can retrieve deployment configuration details. Typically, users need to have 'deployment-manager' or 'administrator' roles to access this configuration information.

Behind the scenes, this endpoint invokes the \`getDeploymentConfig\` action within the deployment-manager service. It initiates a process to load and return detailed configuration parameters specific to a given deployment. This involves parsing configuration files or accessing a database where these details are stored, ensuring that all returned data respects current operational and security policies. The final response includes a structured JSON object that encapsulates all necessary deployment settings.`,
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
