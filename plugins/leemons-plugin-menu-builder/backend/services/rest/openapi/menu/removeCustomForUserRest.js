const { schema } = require('./schemas/response/removeCustomForUserRest');
const {
  schema: xRequest,
} = require('./schemas/request/removeCustomForUserRest');

const openapi = {
  summary: 'Remove custom menu settings for a specific user',
  description: `This endpoint removes custom menu settings applied to a specific user, effectively resetting their menu experience to the default settings configured by the system.

**Authentication:** The user needs to be logged-in to perform this operation. If the user's session is not active or the authentication token is missing, the request will be denied.

**Permissions:** This operation requires administrative permissions related to menu configuration management. The user must have the 'menu.customize' permission to execute this action.

The flow of this operation begins with the 'removeCustomForUserRest' method in the 'menu.rest.js' service file. Once invoked, this method first checks for user authentication and permissions. If these checks pass, the method then calls the underlying business logic in the 'menu-item' core module, specifically targeting the remove customization functionality. It manipulates data related to user-specific menu items in the database, ensuring any custom settings are removed. On successful operation, a response indicating successful removal is sent back to the user; otherwise, an error message is generated detailing the failure reason.`,
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
