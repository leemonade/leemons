const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'Lists accessible digital assets based on category permissions',
  description: `This endpoint lists all digital assets that are accessible to the currently authenticated user based on their category permissions. It involves filtering assets depending on categories where the user has viewing or higher-level permissions.

**Authentication:** Users must be logged in to list the digital assets based on their category permissions. The endpoint requires a valid authentication token, and failure to provide one will prevent access to the endpoint.

**Permissions:** Users require 'list' permissions within the asset's category to be able to view and list the assets. Higher level permissions like 'edit' or 'delete' are not required for listing assets, but they will determine the level of interaction the user can have with each listed asset.

The endpoint's logic initiates by calling a method that determines the user’s roles and associated category permissions. It then filters the assets based on the permissions and ensures that only those categories where the user has at least 'list' permissions are considered. This flows into a retrieval process where all assets associated with these categories are compiled. The resulting list of assets is then formatted appropriately and sent back to the user as a JSON array, providing a clear view of the accessible digital assets as determined by their category-level permissions within the system.`,
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
