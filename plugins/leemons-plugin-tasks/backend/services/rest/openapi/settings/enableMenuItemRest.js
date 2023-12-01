const { schema } = require('./schemas/response/enableMenuItemRest');
const { schema: xRequest } = require('./schemas/request/enableMenuItemRest');

const openapi = {
  summary: 'Enable a specific menu item for user navigation',
  description: `This endpoint allows for the activation of a menu item within the user's UI navigation structure. The action specifically targets a menu item identifier and changes its state to ensure that it is accessible to the user through the platform's navigation interface.

**Authentication:** To utilize this endpoint, a user session must be active and properly authenticated. Unauthorized requests are rejected.

**Permissions:** Appropriate permissions are required for a user to enable a menu item. These permissions ensure that only users with the right to alter navigation settings can perform this action.

Upon receiving a request, the endpoint initiates the \`enableMenuItem\` service action, which expects a payload containing an identifier for the targeted menu item. The service then checks if the current user has the necessary permission to enable the menu item. If the user is permitted, the change is persisted to the system, updating the navigation structure. The flow encapsulates the process from verifying user permissions to the actual update of the menu item state. The response then reflects the outcome of the operation, indicating success or failure to the client.`,
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
