const { schema } = require('./schemas/response/listByIdsRest');
const { schema: xRequest } = require('./schemas/request/listByIdsRest');

const openapi = {
  summary: 'List assets by specified IDs',
  description: `This endpoint is responsible for fetching a collection of assets based on a specified set of asset IDs. The assets retrieved are determined by the user's access level and relation to the asset, ensuring that only permissible items are returned.

**Authentication:** User authentication is required to ensure that access to assets is properly gated. Only authenticated users are allowed to execute this endpoint and retrieve asset information.

**Permissions:** Users need to have appropriate permissions to view the requested assets. The exact permission checks depend on the asset's sharing settings and user privileges.

Upon receiving a request, the \`listByIdsRest\` action begins by validating the list of asset IDs provided by the user. It then proceeds to call the \`getByIds\` core module, which is responsible for building the database query and retrieving the asset information. The \`getByIds\` flow involves several steps, including getting user permissions for each asset (\`getUserPermissionsByAsset\`), merging the asset data with related entities such as subjects and files, and aggregating any additional asset-specific information. Once the data is fetched and processed, it is returned to the user in a structured response, containing an array of the assets that the user is authorized to access.`,
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
