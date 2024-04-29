const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update task settings',
  description: `This endpoint handles the updates to task-specific settings within the leemons platform. It allows modifications to settings related to tasks which could include preferences, configurations, and rules specific to how tasks are managed within the system.

**Authentication:** Users need to be authenticated to perform updates on the settings. Proper auth tokens must be provided to access this endpoint, otherwise, the request will be rejected.

**Permissions:** The user must have administrative or relevant task-specific permissions to update settings. Lack of required permissions will result in a denial of access to this endpoint.

Upon receiving a request, this endpoint first verifies user authentication and permissions. If both checks are passed, it proceeds to invoke the \`updateSettings\` method drawn from the \`Settings\` core module. This method accepts parameters that include the new settings data and identifies which settings need to be updated based on the input provided by the user. The function efficiently updates the required settings in the database and returns confirmation of the updates. A response with success status and any relevant updated settings information is then sent back to the client.`,
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
