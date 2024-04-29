const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Retrieve specific assets based on provided IDs',
  description: `This endpoint is designed to fetch a detailed list of assets by their unique identifiers. It caters to retrieving comprehensive asset details which could include metadata, associated permissions, user roles, and more, depending on the asset's configuration and user's access rights.

**Authentication:** Access to this endpoint requires user authentication. Users need to pass valid authentication tokens with their requests to prove their identity and session validity.

**Permissions:** Users must have appropriate permissions to view the requested assets. The specific permissions required will depend on the assets being accessed and the level of detail required. Permissions checks are integral to ensure that users can only retrieve data for assets they are authorized to access.

Upon receiving a request, the endpoint processes input IDs and invokes several internal methods to retrieve the assets. These methods include querying the database for asset details, checking user permissions, and potentially aggregating additional data related to each asset such as associated files, permissions, or related programs. The result encapsulates a comprehensive view of each asset, tailored to the authenticated user’s access rights. The response is then formatted as a JSON object containing all the necessary details about each asset.`,
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
