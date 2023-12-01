const { schema } = require('./schemas/response/removePinRest');
const { schema: xRequest } = require('./schemas/request/removePinRest');

const openapi = {
  summary: 'Remove a pinned asset',
  description: `This endpoint allows for the removal of a pinned asset from the user's collection. It effectively unpins the digital asset that the user has previously marked as favorite or important, so it no longer appears in their prioritized list of items.

**Authentication:** Access to this endpoint requires the user to be authenticated. Users must provide a valid authentication token to be granted permission to unpin an asset.

**Permissions:** Users need to have the 'unpin_asset' permission to perform this operation. Without the required permission, the attempt to unpin an asset will be rejected.

Upon receiving a request to unpin an asset, the handler first involves authorizing the user by checking the validity of the authentication token presented. After authentication, the user's permissions are verified to ensure they have the rights to perform the unpin operation. If the checks pass, the handler proceeds to call the \`removePin\` method from the underlying service layer, which interacts with the database to remove the pin association for the specified asset. The \`removePin\` method expects the asset's identifier which is passed in the request data. On successful removal of the pin, a confirmation is sent back to the user. If any part of the process fails, relevant error messages are generated and returned to the requester.`,
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
