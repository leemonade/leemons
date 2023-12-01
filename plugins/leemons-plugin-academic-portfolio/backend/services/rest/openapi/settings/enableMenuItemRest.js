const { schema } = require('./schemas/response/enableMenuItemRest');
const { schema: xRequest } = require('./schemas/request/enableMenuItemRest');

const openapi = {
  summary: 'Enables a specific menu item within the academic platform',
  description: `This endpoint enables a particular menu item for use within the academic portfolio module. It is useful for administrators who wish to update the state of menu items, typically as part of configuring the user interface for end users.

**Authentication:** Users must be authenticated and have a valid session to make changes to menu item configurations. Unauthorized attempts to enable menu items will be rejected.

**Permissions:** To enable a menu item, the user must have administrative privileges or relevant permissions to modify the platform configuration. A permission check is performed to ensure that the operation is authorized.

Upon receiving a request, the handler first validates the input parameters to ensure that the required data for enabling the menu item is present and correct. It then calls a specific method responsible for updating the menu item state in the database. This method will typically interact with a persistence layer to change the enablement status of the specific menu item. If successful, the update to the menu item is committed, and the handler responds with a status indicating that the action has been completed. Error handling mechanisms are in place to catch any exceptions that occur during this process, providing appropriate error messages back to the client in case of failure.`,
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
