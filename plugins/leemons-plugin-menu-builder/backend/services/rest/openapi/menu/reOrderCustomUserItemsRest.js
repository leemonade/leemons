const { schema } = require('./schemas/response/reOrderCustomUserItemsRest');
const {
  schema: xRequest,
} = require('./schemas/request/reOrderCustomUserItemsRest');

const openapi = {
  summary: 'Reorders the menu items for a custom user',
  description: `This endpoint facilitates the reordering of menu items specifically customized for a user, based on their unique preferences or permissions. The operation adjusts the order of menu items in a list format, ensuring the display order aligns with user- or administrator-defined preferences.

**Authentication:** Users need to be authenticated to modify the order of menu items. Access to this endpoint requires a valid session or authentication token.

**Permissions:** Users must have specific role permissions that allow them to rearrange menu items. Typically, this would include administrators or users with role-based access control rights specific to menu configuration.

The endpoint initiates by processing the passed order configuration, which includes identifying menu items and their new positions as defined in the request. It invokes the \`updateOrder\` method from the \`MenuItemService\`, which handles the reordering logic, interfacing directly with the database to update menu item positions accordingly. This process ensures that the new order is accurately reflected in subsequent menu displays, offering a tailored user interface experience. The response confirms the successful reordering of the menu items.`,
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
