const { schema } = require('./schemas/response/removeCustomForUserRest');
const {
  schema: xRequest,
} = require('./schemas/request/removeCustomForUserRest');

const openapi = {
  summary: 'Remove custom menu items for a specific user',
  description: `This endpoint allows the removal of custom menu items that have been assigned to a specific user. Custom menu items are those that are not part of the default menu configuration and are often tailored to meet individual user needs or preferences.

**Authentication:** Users must be authenticated to modify custom menu configurations. The system will validate the user's identity and permissions before allowing changes to be made.

**Permissions:** Appropriate permissions are required to remove custom menu items. Only users with the authority to manage user-specific menu configurations will be granted access to this functionality.

The removal process is initiated when the \`removeCustomForUserRest\` action is called. This action retrieves the necessary parameters from the client's request, such as the user identifier and menu item details designated for removal. It then calls upon the \`removeCustomForUser\` method defined in the \`menu-item\` core, ensuring that the operation adheres to the business logic encapsulated within. Upon successful execution, the endpoint responds with a confirmation of the changes made, and the custom menu items are no longer accessible to the user in the system.`,
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
