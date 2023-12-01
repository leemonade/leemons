const { schema } = require('./schemas/response/saveAdminConfigRest');
const { schema: xRequest } = require('./schemas/request/saveAdminConfigRest');

const openapi = {
  summary: 'Save administrative configuration settings',
  description: `This endpoint is responsible for saving global configuration settings related to administrative functions of the application. These settings may include system-wide preferences, feature toggles, and other high-level operational parameters.

**Authentication:** Users must be logged in and have an administrative role to modify these settings. Unauthorized access attempts will be rejected.

**Permissions:** The user requires administrative privileges, specifically the 'admin.config.save' permission, to update these settings. Without the proper permissions, the user will be denied access to this endpoint.

Upon receiving a request, this handler begins by validating the provided configuration payload against predefined schemas to ensure that all required fields are present and correctly formatted. Once validation is complete, it calls the \`saveAdminConfig\` method, which interacts with the underlying database to persist the provided settings. This method encapsulates the business logic for processing configuration data and ensures that only authorized changes are applied to the system. After successful persistence, the handler sends back a confirmation message along with the saved configuration data, or, in case of an error, it returns the appropriate HTTP error response.`,
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
