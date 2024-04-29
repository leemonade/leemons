const { schema } = require('./schemas/response/getAdminConfigRest');
const { schema: xRequest } = require('./schemas/request/getAdminConfigRest');

const openapi = {
  summary: 'Manage administrative configuration settings',
  description: `This endpoint manages and retrieves the comprehensive administrative configuration settings for the platform. This encompasses fetching, updating, and verifying the settings associated with various administrative parameters within the system.

**Authentication:** Users need to be authenticated and recognized as administrators to access this endpoint. Unauthorized access will be blocked, and the user will also be notified about the necessary authentication requirements if they are not met.

**Permissions:** This endpoint requires the user to have administrative privileges. The system checks for 'admin_config_access' permission specifically. If the user does not have the required permission, the request will be rejected, and an error message will be issued detailing lack of permissions.

Upon receiving a request, the 'getAdminConfigRest' handler initiates by validating the user's authentication and permission levels. It then proceeds to consult several service methods like 'getFullByCenter', 'getGeneral', 'getCenter', and 'getProgram' to gather comprehensive configuration data spread across different administrative levels and contexts of the platform. These methods collectively contribute to forming a complete configuration dataset that is then returned in a structured response to the client, distinctly outlining each section of the relevant configuration data.`,
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
