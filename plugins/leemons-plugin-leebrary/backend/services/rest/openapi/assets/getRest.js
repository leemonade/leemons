const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Fetches a collection of assets based on provided identifiers',
  description: `This endpoint is responsible for fetching a detailed list of assets identified by a collection of unique identifiers. The response includes all relevant information about each asset, such as metadata, associated files, permissions, categories, and tags specific to the assets requested.

**Authentication:** The endpoint requires users to be authenticated before attempting to retrieve asset information. The access is granted only if a valid authentication token is provided in the request headers.

**Permissions:** Users must have the appropriate permissions to view the assets. The endpoint checks for 'read' permissions against each requested asset and filters out any assets that the user does not have the authority to access.

Upon receiving the request, the endpoint initially calls the 'getByIds' action from the assets service. This action utilizes auxiliary functions such as 'buildQuery' to create a database query tailored to the provided asset identifiers. It then proceeds to 'getAssetsWithPermissions' to verify the user's access rights to each asset. Other functions like 'getAssetsWithSubjects', 'getAssetsWithFiles', 'getAssetsTags', and 'getAssetsCategoryData' enrich the resulting assets by gathering additional information related to each asset. The endpoint aggregates data from various sub-services and database tables to construct a comprehensive view of the assets. It finally calls the 'processFinalAsset' function, which formats and returns the results. The full asset information is sent back as a JSON response, allowing the client to receive a clear and thorough snapshot of the assets they are permitted to view.`,
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
