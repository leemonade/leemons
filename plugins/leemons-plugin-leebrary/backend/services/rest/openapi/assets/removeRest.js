const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Removes a specified asset from the library',
  description: `This endpoint allows for the deletion of a specified asset from the library according to its unique identifier. The asset is permanently removed from the database and all associated metadata and permissions settings are also deleted.

**Authentication:** Users must be authenticated to delete assets. The system validates the user's authentication token, and failure to provide a valid token results in denial of access to the endpoint.

**Permissions:** The user must have administrative or specific deletion permissions for the asset they attempt to remove. If the user lacks the necessary permissions, the endpoint will deny access and return an error.

Upon receiving a request, the handler in \`assets.rest.js\` invokes the \`remove\` action from the corresponding service. This action utilizes methods defined in \`remove.js\` and related files to check the user's permissions, validate the existence of the asset, and proceed with the deletion process from the database. Detailed error handling ensures feedback is provided for failures such as missing permissions, non-existent assets, or database errors. The flow ensures a secure operation protecting the integrity and access control of asset data within the system.`,
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
