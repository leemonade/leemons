const { schema } = require('./schemas/response/coverRest');
const { schema: xRequest } = require('./schemas/request/coverRest');

const openapi = {
  summary: 'Obtain the cover asset for a specific file',
  description: `This endpoint provides access to the cover asset related to a given file identifier. Access to this cover asset enables front-end services to display the appropriate imagery for user interfaces or other asset-referencing features.

**Authentication:** Access to this endpoint requires the user to be authenticated. An active session or a valid authentication token must be provided to successfully interact with this endpoint.

**Permissions:** Users must have the 'read' permission on the specified file in order to retrieve its associated cover asset. The system checks for this permission level before granting access to the cover asset.

Upon receiving a request, the \`coverRest\` handler in the \`files.rest.js\` file begins by validating the provided file identifier and ensuring that the requesting user has the necessary permissions to access the file's cover asset. It then calls the \`getCoverAssetByFileId\` method from the associated core service, passing the file ID and context which includes user authentication data. This method is responsible for retrieving the cover asset details from the underlying database. Once retrieved, the endpoint returns the cover asset's information, typically including a URL to the asset, in the response payload formatted as JSON.`,
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
