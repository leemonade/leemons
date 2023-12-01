const { schema } = require('./schemas/response/updateCustomForUserRest');
const {
  schema: xRequest,
} = require('./schemas/request/updateCustomForUserRest');

const openapi = {
  summary: 'Updates custom menu items for a user',
  description: `This endpoint updates custom configurations for specific menu items for an individual user, allowing for a personalized menu experience within the platform.

**Authentication:** The user must be authenticated to update their custom menu configurations. Access to this endpoint is restricted without valid authentication credentials.

**Permissions:** Required permissions for this action include the ability to modify user-specific menu items. Users without this level of permission will be unable to execute this endpoint successfully.

The flow begins with the \`updateCustomForUserRest\` handler being requested with the necessary input parameters. It then calls the \`updateCustomForUser\` method from the \`MenuItem\` core module, which is responsible for handling the update logic. This method takes the user's identification and custom menu item data, performs validation using the \`menu-item.js\` schema, and applies the changes to the user's menu configuration in the database. Upon success, the endpoint responds with the updated user-specific menu data. In the case of a failure, it provides the appropriate error message to the user.`,
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
