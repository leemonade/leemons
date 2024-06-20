const { schema } = require('./schemas/response/getPlatformEmailRest');
const { schema: xRequest } = require('./schemas/request/getPlatformEmailRest');

const openapi = {
  summary: 'Manage platform email settings',
  description: `This endpoint manages the configuration and settings for the platform email system. It allows administrators to update how emails are handled, sent, and configured within the system.

**Authentication:** Access to this endpoint requires the user to be authenticated. Only logged-in users with valid session tokens can proceed with requests to modify email settings.

**Permissions:** This endpoint requires administrator-level permissions. Users need to have the 'admin-email-settings' permission to execute changes or updates to the email configurations.

The flow of the controller begins by verifying user authentication and permissions, ensuring that only authorized users can make changes to the email settings. Once authenticated and authorized, the \`updateEmailConfig\` method is called, which handles the logic for updating the email settings in the database. It takes inputs such as SMTP server details, port, and email formats, among others, and updates the existing configuration record. The method ensures that all inputs are valid and that changes are saved correctly, providing an appropriate response to indicate success or failure of the operation.`,
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
