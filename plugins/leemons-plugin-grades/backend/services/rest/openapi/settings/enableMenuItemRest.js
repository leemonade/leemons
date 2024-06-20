const { schema } = require('./schemas/response/enableMenuItemRest');
const { schema: xRequest } = require('./schemas/request/enableMenuItemRest');

const openapi = {
  summary: 'Enables a specific menu item configuration for user roles',
  description: `This endpoint enables a specific menu item within the application based on specified configurations linked to user roles. The endpoint focuses on adjusting the visibility and availability of menu items according to the roles that have access to them, enhancing the customization of the user interface per user role criteria.

**Authentication:** Users need to be authenticated to alter the configuration of menu items. This ensures that only authorized personnel can make changes to the menu settings.

**Permissions:** The user must have administrative or relevant configurational permissions to enable menu items. Failing to meet the permission requirements will result in a denial of access to the endpoint.

Upon receiving a request, the 'enableMenuItemRest' handler triggers a method in the underlying settings service. This method is tasked with updating the menu configuration settings in the database. These settings dictate which roles can view or interact with specified menu items. The whole operation is transactional, thus any failure during the update reverts any partial changes. Upon successful modification, a confirmation response is sent back to the requester, indicating successful enablement of the menu item.`,
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
