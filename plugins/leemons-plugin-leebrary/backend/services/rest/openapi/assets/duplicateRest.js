const { schema } = require('./schemas/response/duplicateRest');
const { schema: xRequest } = require('./schemas/request/duplicateRest');

const openapi = {
  summary: 'Duplicates an asset based on a provided ID',
  description: `This endpoint facilitates the duplication of a digital asset identified by its unique ID. The duplication process includes duplicating the asset's metadata, tags, associated files, and any specific permissions or categorizations linked to the original asset.

**Authentication:** Users must be authenticated and possess the required session tokens to initiate a duplication request. Authentication verifies user identity and session validity before proceeding.

**Permissions:** Users need specific 'duplicate' permissions on the asset they intend to duplicate. Without these permissions, the request will be denied, ensuring that only authorized users can duplicate assets.

Upon receiving a duplication request, the endpoint initially verifies user authentication and checks if the user has the necessary duplication permissions for the specified asset. If authenticated and authorized, the endpoint calls multiple services: it retrieves the original asset's information, checks for existing duplicates, and then proceeds to duplicate the asset's metadata, files, and tags. Throughout this process, all related entities such as bookmarks or categories associated with the asset are also considered for duplication. The final output is the creation of a new asset entry in the database, echoing the properties of the original while ensuring data consistency and integrity.`,
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
