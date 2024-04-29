const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update asset details',
  description: `This endpoint is responsible for updating the details of a specific asset in the repository. It accepts updates to various fields of an asset, including but not limited to, the asset’s name, description, and associated metadata. The endpoint processes these updates and ensures the asset's data integrity is maintained throughout the update procedure.

**Authentication:** Users must be authenticated to modify asset data. The system will validate the user’s authentication token before proceeding with the update process.

**Permissions:** Appropriate permissions are required to update asset details. Users must have edit or admin rights on the specific asset they are attempting to update. The system checks for these permissions before accepting the update request.

Upon receiving the request, the \`updateRest\` handler invokes the \`updateAsset\` method from the \`Assets\` core service. This method meticulously validates the updated data against existing records for conflicts and compliance with business rules. After validation, it proceeds to update the database records. The method coordinates with various sub-services like permissions checking and data validation, ensuring a robust and secure update process. The response from this method will confirm whether the update has been successful, with appropriate error handling for any issues encountered during the update.`,
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
