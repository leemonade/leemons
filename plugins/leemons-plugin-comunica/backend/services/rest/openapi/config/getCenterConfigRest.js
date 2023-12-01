const { schema } = require('./schemas/response/getCenterConfigRest');
const { schema: xRequest } = require('./schemas/request/getCenterConfigRest');

const openapi = {
  summary: 'Fetch configuration for a specific center',
  description: `This endpoint retrieves the configuration details for a given center within the leemons platform. It includes configuration parameters that define how the center operates and interacts with various plugins and services.

**Authentication:** Users need to be logged into the system with valid credentials to access center configurations. Unauthorized access attempts will be rejected.

**Permissions:** Appropriate permissions must be granted to the user for accessing the configuration of a center. Users without sufficient privileges will not be able to retrieve center configuration details.

Upon receiving a request, the \`getCenterConfigRest\` handler begins by verifying the user's authentication and authorization to ensure they have the right to access the configuration information. If the authentication and permissions checks pass, it then calls the \`getCenter\` function from the \`leemons-plugin-comunica/backend/core/config\` module, which accesses the backend storage to retrieve the specified center's configuration details. The data is then formatted as needed and returned to the user in the form of a JSON object representing the center's configuration. This process involves various error handling routines to deal with potential issues such as missing configuration data or access denial.`,
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
