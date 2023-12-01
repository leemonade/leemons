const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update task plugin settings',
  description: `This endpoint updates the task plugin settings with the new values provided in the request body. The accepted settings are specific to the task plugin's configuration requirements and include options such as task behavior, permissions, and notifications configurations.

**Authentication:** Users must be authenticated and have a valid session to update the task plugin settings. Authentication is verified through session tokens or API keys as configured in the system.

**Permissions:** The user must have administrative rights or specific permission to modify task plugin settings. The required permission level may vary based on the organizational policy and the scope of the settings being updated.

Upon receiving the update request, the \`updateRest\` handler in the \`settings.rest.js\` service file delegates the task to the core settings module by calling the \`updateSettings\` method from \`leemons-plugin-tasks/backend/core/settings/update.js\`. This method is responsible for validating the new settings, ensuring they adhere to the plugin's schema, and persisting them to the database. If the update operation is successful, the method returns an acknowledgment; otherwise, it throws an error that is caught by the REST service, which then responds to the client with the appropriate error message and status code.`,
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
