const { schema } = require('./schemas/response/reOrderCustomUserItemsRest');
const {
  schema: xRequest,
} = require('./schemas/request/reOrderCustomUserItemsRest');

const openapi = {
  summary: 'Reorder user-specific custom menu items',
  description: `This endpoint allows for the reordering of user-specific custom menu items within the application. The order of these items can be personalized according to the user's preferences or organizational requirements.

**Authentication:** Users must be authenticated with valid session credentials to request a reordering of menu items. Unauthenticated access will result in a rejection of the reordering operation.

**Permissions:** Users need to have the 'menu-item-reorder' permission to rearrange the order of the menu items. Without the proper permissions, the request will be denied, ensuring that only authorized users can modify the menu structure.

After authenticating the user and verifying their permissions, the handler proceeds to validate the request payload using \`menu-item.js\` validations. Once the input is deemed valid, it calls the \`reOrderCustomUserItems\` function from \`menu-item/index.js\`. This function takes the specified order of menu items and performs necessary updates to the user's menu configuration in the persistent storage, typically a database. The process ensures that menu items are arranged in the new specified order and that these changes are reflected immediately in the user's interface upon their next interaction with the menu.`,
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
