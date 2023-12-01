const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Manages organization configuration details',
  description: `This endpoint is responsible for handling organization-level configurations, such as updating organization details, managing organizational themes, and handling various organizational settings and preferences.

**Authentication:** Users must be authenticated and possess valid session tokens to interact with this endpoint. Unauthorized access attempts are rejected.

**Permissions:** Users need to have administrative rights to modify organization settings. The specific rights are defined within the platform's role-based access control configurations.

After authentication and permission checks, the handler invokes several methods depending on the action requested. Typical actions include \`getOrganization\` for retrieving current settings, \`updateOrganization\` to apply changes, or \`getJsonTheme\` to fetch the current theme settings. Each method interacts with the underlying data models and services to accurately reflect the organization's state, persist changes, and ensure that configurations comply with the platform's schema and business rules. Outputs are sent back to the requester in JSON format, encapsulating the status of the operation and any relevant configuration data.`,
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
