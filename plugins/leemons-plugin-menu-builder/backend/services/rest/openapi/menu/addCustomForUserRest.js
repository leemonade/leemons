const { schema } = require('./schemas/response/addCustomForUserRest');
const { schema: xRequest } = require('./schemas/request/addCustomForUserRest');

const openapi = {
  summary: 'Adds a custom menu item for a specific user',
  description: `This endpoint allows for the addition of a custom menu item specifically tailored for a user. The process involves creating a unique menu item that does not typically appear in the standard menu configurations.

**Authentication:** User authentication is mandatory for this endpoint. Users must provide valid credentials to perform this operation, ensuring that only authorized users can add custom menu items.

**Permissions:** The user must have the 'manage_custom_menus' permission. This permission check ensures that only users with sufficient privileges can modify or add to the menu tailored to user-specific needs.

The handler initiates by validating the incoming data against a pre-defined schema to ensure all required fields are present and valid. Post-validation, the \`addCustomMenuItemForUser\` method from the \`MenuService\` is invoked with parameters including the user's ID and detailed menu item data. This method handles the logic of integrating the new item into the user's existing menu structure, while also checking for any potential conflicts or duplication issues. Once successfully added, the service returns confirmation of the addition, which is then relayed back to the user through the endpoint's response.`,
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
