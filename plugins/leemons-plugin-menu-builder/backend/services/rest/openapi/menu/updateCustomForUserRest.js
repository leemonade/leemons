const { schema } = require('./schemas/response/updateCustomForUserRest');
const {
  schema: xRequest,
} = require('./schemas/request/updateCustomForUserRest');

const openapi = {
  summary: 'Update custom settings for a user menu',
  description: `This endpoint allows the modification of custom menu configurations for a specific user, ensuring the user's menu reflects any personalized changes such as order or visibility of menu items.

**Authentication:** Users need to be authenticated to modify their menu settings. Without proper authentication, the request will not be processed.

**Permissions:** This action requires the user to have permissions to alter their own menu settings. Typically, this might involve checking if the user has 'manage_menus' or equivalent permission within the system.

Upon receiving a request, the 'updateCustomForUserRest' handler first validates the incoming data against the schema defined in 'menu-item.js'. It ensures all provided menu item adjustments adhere to the expected formats and values. If validation passes, it proceeds by invoking the \`updateCustomForUser\` method from the 'menu-item' core module. This method is responsible for applying the changes to the database, reflecting the custom user preferences for menu structure. The completion of this database update results in the final response, informing the client about the success or failure of the operation.`,
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
