const { schema } = require('./schemas/response/enableMenuItemRest');
const { schema: xRequest } = require('./schemas/request/enableMenuItemRest');

const openapi = {
  summary: 'Activates a specific menu item in the user interface',
  description: `This endpoint enables a specific menu item in the system's user interface, making it visible and accessible to users. This action typically involves updating a configuration setting or database entry to reflect the new state of the menu item.

**Authentication:** Users must be authenticated to modify the visibility of menu items. An invalid or missing authentication token will prevent access to this endpoint.

**Permissions:** Users need specific administrative permissions related to UI configuration or menu management to enable a menu item. Without appropriate permissions, the request will be denied.

Upon receiving a request, the \`enableMenuItemRest\` handler verifies the user's authentication and permission levels. If the validation passes, it proceeds to call the \`enableMenuItem\` method. This method updates the necessary configurations to set the menu item's status to active. The entire process involves validating the input, checking permissions, updating the setting via a database transaction, and finally, responding with the success status of the operation if all conditions are met.`,
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
