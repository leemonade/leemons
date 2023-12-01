const { schema } = require('./schemas/response/addCustomForUserRest');
const { schema: xRequest } = require('./schemas/request/addCustomForUserRest');

const openapi = {
  summary: 'Adds a custom menu item for a specific user',
  description: `This endpoint enables the creation of a custom menu item that is tailored to an individual user's needs. The feature allows for the customization of the user's navigation experience within the application by injecting personalized menu items into their menu structure.

**Authentication:** User authentication is mandatory to ensure that the custom menu item is associated with the correct user profile. Access is denied if the authentication credentials are not provided or are invalid.

**Permissions:** The user must have the necessary permissions to modify their menu structure. This typically requires the privilege to edit personal settings or preferences within the application.

Upon receiving a request, the handler \`addCustomForUserRest\` calls upon the \`addCustomForUser\` method from the \`menu-item\` core. It starts by validating the request payload against predefined schema rules to ensure that all necessary information for creating a custom menu item is present and correctly formatted. Once validated, it interacts with the menu management system to insert the new menu item into the user's personalized menu, adhering to any specified ordering or grouping criteria. The system then confirms the addition of the menu item by returning information about the newly created item, including its identifier and position within the user's menu structure.`,
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
