const { schema } = require('./schemas/response/pinsRest');
const { schema: xRequest } = require('./schemas/request/pinsRest');

const openapi = {
  // summary: "Summary",
  description: `
{
  "summary": "Manage user's pinned assets",
  "description": "This endpoint allows the user to manage their collection of pinned assets. It includes functionality to list, add, or remove digital assets from their personal curated set of pins.

**Authentication:** User authentication is mandatory to access or modify the pinned assets. Users must provide a valid authentication token to interact with the endpoint.

**Permissions:** The endpoint requires that users have appropriate permissions to pin or unpin assets. It checks that the user has the ability to modify their own set of pinned assets, ensuring no unauthorized changes to other users' pins.

The handler for the pinsRest property starts by validating the user's authentication and permissions. It then determines the requested action (list, add, or remove) and calls the corresponding method in the backend service. For listing, it fetches the user's current pinned assets by making a database query filtered by the user's ID. For adding a new pin, it verifies the asset's existence and whether the user has access to it, then adds an entry linking the user to the asset. When removing a pin, it ensures that the pin exists and belongs to the current user before removing the linkage. Finally, the response is formulated based on the outcome of these operations, returning either the updated list of pinned assets or a confirmation of the addition/removal process."
}
`,
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
