const { schema } = require('./schemas/response/getAdminConfigRest');
const { schema: xRequest } = require('./schemas/request/getAdminConfigRest');

const openapi = {
  summary: 'Retrieve configuration settings for the admin user',
  description: `This endpoint returns the full configuration settings available to the administrator user. The data includes various configuration parameters relevant for the administration of the SaaS platform.

**Authentication:** User authentication is required to ensure that only authorized administrators can retrieve configuration settings. Unauthenticated access is prohibited and will result in an access error.

**Permissions:** The user must have administrative privileges in order to fetch configuration settings through this endpoint. Without the necessary permissions, the request will be rejected.

Upon receiving a request, the \`getAdminConfigRest\` handler invokes the \`getFullByCenter\`, \`getGeneral\`, \`getCenter\`, and \`getProgram\` functions from the \`leemons-plugin-comunica\`'s config core module in sequence. Each function is responsible for aggregating specific parts of the overall platform configuration. The \`getFullByCenter\` function fetches configuration tied to educational centers, \`getGeneral\` retrieves general settings, while \`getCenter\` and \`getProgram\` provide center-specific and program-specific settings respectively. The combined result from these functions is then formatted into a cohesive JSON object which is returned to the administrator as the response to the request.`,
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
