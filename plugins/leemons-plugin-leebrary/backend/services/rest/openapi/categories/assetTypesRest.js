const { schema } = require('./schemas/response/assetTypesRest');
const { schema: xRequest } = require('./schemas/request/assetTypesRest');

const openapi = {
  summary: 'Manage category-related asset types',
  description: `This endpoint handles the retrieval and management of asset types related to specific categories within the platform. It provides functionalities such as fetching existing asset types linked to a category, updating them, and adding new asset type connections to categories.

**Authentication:** Users must be logged in to interact with asset types related to categories. Access to this endpoint requires valid user authentication credentials.

**Permissions:** Users need specific permissions related to asset type management. Typically, this includes permissions like 'read_asset_types', 'create_asset_types', and 'edit_asset_types' to perform respective actions within the endpoint.

Upon receiving a request, the endpoint first verifies the user's authentication and permissions. If the validation succeeds, it proceeds to call methods from the 'Categories' and 'AssetTypes' services. Actions such as querying the database for asset types linked to specific categories, adding new asset type connections, or updating existing connections are performed based on the request parameters. Each action involves interactions with database models and may include complex business logic to handle various edge cases and ensure data integrity. The response from these actions is formatted and returned to the user, providing detailed feedback on the outcome of the request.`,
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
