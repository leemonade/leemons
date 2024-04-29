const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Configure academic calendar settings',
  description: `This endpoint allows for the configuration of academic calendar settings within the Leemons platform. It enables the adjustment and saving of parameters such as term dates, holiday periods, and other related academic calendar details.

**Authentication:** User authentication is required to access this endpoint. Unauthenticated access will be prevented, and users must have a valid session or token to proceed.

**Permissions:** This endpoint requires administrative privileges. Users must have the \`admin-academic-calendar\` permission to modify the academic calendar settings.

From the initial API call, the handler invokes the \`getConfig\` method from the 'config' core module. This method retrieves the current configuration settings from the system's database. Following this, users can modify these settings through a form-based interface provided in the frontend. Upon submission, the \`setConfig\` method is called with the new configuration data. This method updates the settings in the database, ensuring that any changes are persisted across the system. Finally, a success response is sent back to the user, confirming the update has been successfully applied.`,
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
