const { schema } = require('./schemas/response/getConfigRest');
const { schema: xRequest } = require('./schemas/request/getConfigRest');

const openapi = {
  summary: 'Configure email settings',
  description: `This endpoint allows the modification and retrieval of email-related settings within the plugin. It manages configurations such as SMTP details, default sender address, and email templates preferences, ensuring they are correctly stored and accessible for the email system to function efficiently.

**Authentication:** Users need to be authenticated in order to update or access the email configuration settings. Authentication ensures that only authorized personnel can modify these important settings.

**Permissions:** Appropriate permissions are required to either view or update the email settings. The user must have administrative rights or explicit permissions related to email configuration management.

Upon receiving a request, the handler first verifies the user's authentication and authorization. If validation passes, it proceeds to invoke methods from the \`EmailsSettingService\`. Depending on the action type—\`get\` or \`set\`—it may call \`getConfig\` to retrieve settings or \`saveConfig\` to update them. The involved methods interact with the underlying database or configuration files to fetch or store the email settings respectively. The output is then formatted into a JSON response that reflects the new or existing configuration state.`,
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
