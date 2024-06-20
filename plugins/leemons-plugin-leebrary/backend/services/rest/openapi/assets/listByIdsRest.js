const { schema } = require('./schemas/response/listByIdsRest');
const { schema: xRequest } = require('./schemas/request/listByIdsRest');

const openapi = {
  summary: 'Retrieve a list of assets by their identifiers',
  description: `This endpoint retrieves a list of assets based on a provided array of asset identifiers. The primary function is to fetch detailed information about each asset, which may include metadata, linked files, tags, categories, and associated programs or subjects.

**Authentication:** Users must be authenticated to access this endpoint. Access is denied if the user's session is not valid or the authentication token is missing.

**Permissions:** Users need specific roles or permissions set to retrieve the detailed information of each asset. The required permissions vary based on the asset sensitivity and classification.

The handler initiates by calling the \`getByIds\` method from the \`Assets\` core, which receives an array of asset IDs through the request parameters. It orchestrates several steps: validating user roles with \`getUserPermissionsByAsset\` to check access rights, fetching related asset data such as subjects, files, and tags using respective methods like \`getAssetsWithSubjects\` and \`getAssetsWithFiles\`. Each asset is then processed to append additional data such as category and program specifics with \`getAssetsCategoryData\` and \`getAssetsProgramsAggregatedById\`. Finally, \`processFinalAsset\` method formats the assets into a presentable structure before sending them back in the HTTP response as a JSON formatted list.`,
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
