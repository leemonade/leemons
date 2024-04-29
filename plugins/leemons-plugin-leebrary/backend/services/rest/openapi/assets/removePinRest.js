const { schema } = require('./schemas/response/removePinRest');
const { schema: xRequest } = require('./schemas/request/removePinRest');

const openapi = {
  summary: "Remove a pinned asset from the user's collection",
  description: `This endpoint allows a user to unpin or remove an asset previously marked as important or distinctive in their collection. The function alters the user's pinned asset list by removing a specified asset, thus updating the user's preferences and collection views.

**Authentication:** User authentication is mandatory to ensure that the request to unpin an asset originates from a bona fide source. An invalid or expired authentication token will prevent access to this functionality.

**Permissions:** This endpoint requires that users have proper rights to modify their own pinned assets. The specific permission \`unpin_asset\` should be validated to permit the operation which ensures the integrity and security of user data.

Upon receiving a request, the \`removePinRest\` endpoint first verifies user authentication and permissions. It then proceeds to call the \`unpinAsset\` method within the service logic where the actual unpinning procedure is executed. This method checks the provided asset identifier against the user’s currently pinned assets, and if found, it is removed from the pinned list. The entire process is encapsulated within a transaction to ensure data consistency. Should the operation succeed, a success response is sent back to the user; in case of failure due to reasons such as non-existent asset ID or insufficient permissions, the appropriate error message is returned.`,
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
