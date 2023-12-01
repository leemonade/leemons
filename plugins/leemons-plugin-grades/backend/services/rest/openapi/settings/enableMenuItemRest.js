const { schema } = require('./schemas/response/enableMenuItemRest');
const { schema: xRequest } = require('./schemas/request/enableMenuItemRest');

const openapi = {
  summary: 'Activates a menu item in the grading system',
  description: `This endpoint enables a particular menu item within the grading system plugin interface. Enabled menu items become accessible to users in the application's user interface.

**Authentication:** Users must be authenticated to toggle the menu item's state. Lack of authentication will prevent access to this functionality.

**Permissions:** The user must have administrative or relevant permissions to modify system settings, specifically to enable menu items within the grading system.

Upon receiving a request, the \`enableMenuItemRest\` handler is called to process the enabling of a menu item. It begins by verifying that the user is authenticated and authorized to make such changes. Once security checks are passed, it invokes the \`enableMenuItem\` method from the core grades plugin service. This method handles the business logic required to update the menu configuration in the system. Following successful completion, a confirmation response is sent back indicating that the menu item has been enabled successfully. Any errors during processing are handled and relayed as error messages in the HTTP response.`,
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
