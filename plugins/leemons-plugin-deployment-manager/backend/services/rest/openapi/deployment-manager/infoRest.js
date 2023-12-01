const { schema } = require('./schemas/response/infoRest');
const { schema: xRequest } = require('./schemas/request/infoRest');

const openapi = {
  summary: 'Manage deployment configurations',
  description: `This endpoint allows for the management of platform deployment configurations. It serves as a centralized hub for initiating, monitoring, and controlling various deployment tasks within the SAAS platform.

**Authentication:** A user must be authenticated to interact with deployment-related functionalities. Unauthenticated requests will be denied access to the deployment management features.

**Permissions:** Users need to have specific deployment management permissions granted to operate on this endpoint. Lack of appropriate permissions will result in denied access to deployment management capabilities.

Upon invocation, the \`infoRest\` action within the Deployment Manager's \`deployment-manager.rest.js\` service initiates a process to gather and return data about the current state of deployment configurations. It uses internal service methods to fetch deployment details, orchestrate tasks as needed based on the provided parameters, and collate status updates. The flow integrates necessary checks for user authentication and permissions before proceeding with any deployment-related operations. The final response back to the client encapsulates a comprehensive state of the deployment configurations, formatted as JSON.`,
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
