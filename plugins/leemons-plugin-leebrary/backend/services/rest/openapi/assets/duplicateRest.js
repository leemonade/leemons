const { schema } = require('./schemas/response/duplicateRest');
const { schema: xRequest } = require('./schemas/request/duplicateRest');

const openapi = {
  summary: 'Duplicates an existing asset',
  description: `This endpoint is designed for duplicating a specified digital asset. The duplication includes all the related data associated with the original asset, such as metadata, files, and permissions, creating a new and independent copy in the system.

**Authentication:** Access to this endpoint requires user authentication. Users must provide valid credentials to duplicate an asset.

**Permissions:** Users need to have appropriate duplication permissions for the asset they intend to duplicate. If the user lacks the necessary permissions, the operation will not be permitted.

Upon receiving a request, the handler first calls the \`checkDuplicatePermissions\` method to verify if the user has the requisite permissions to duplicate the specified asset. Next, the \`getAndCheckAsset\` method retrieves the asset information and confirms its eligibility for duplication. The \`handleTags\`, \`handleAssetDuplication\`, and \`handleFilesDuplication\` functions are then executed in sequence to duplicate related tags, asset data, and associated files, respectively. During the process, any necessary adjustments for the new duplicated asset are handled, including metadata, versioning, and sharing settings. The complex flow ensures that the duplication process is comprehensive, creating an exact, self-contained duplicate of the original asset. Finally, the service responds with the newly created asset's details or an appropriate error message if the operation failed at any point.`,
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
