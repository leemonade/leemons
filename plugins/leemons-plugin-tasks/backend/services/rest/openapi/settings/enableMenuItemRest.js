const { schema } = require('./schemas/response/enableMenuItemRest');
const { schema: xRequest } = require('./schemas/request/enableMenuItemRest');

const openapi = {
  summary: 'Enables a specific menu item for user interaction',
  description: `This endpoint allows the enabling of a specific menu item, making it available for user interaction within the application. The functionality is typically used in dynamic UI configurations where menu items can be conditionally available based on certain system states or user roles.

**Authentication:** Users need to be authenticated to perform this action. The endpoint ensures that the request contains a valid authentication token, which is verified before proceeding with the menu item enable process.

**Permissions:** This operation requires administrative permissions. A user must have the 'manage_menus' permission to enable or modify menu items, ensuring that only authorized personnel can make changes to the application’s UI structure.

The process begins by capturing the menu item identifier from the request parameters. The \`enableMenuItem\` method of the 'MenuService' is then invoked, with necessary checks for user permissions and item existence. Once validated, the method updates the menu item's status to 'enabled' in the database. This change allows the item to be interactively accessible in the user interface, reflecting the updated state. The flow concludes with a confirmation response indicating the successful enabling of the menu item.`,
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
