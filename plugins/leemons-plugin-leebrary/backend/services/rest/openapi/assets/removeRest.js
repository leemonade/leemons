const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove specified assets from the digital library',
  description: `This endpoint allows for the deletion of a user's selected assets from the digital library. Deletion is permanent and removes the assets from the system, including all related data and properties.

**Authentication:** Users need to be authenticated and provide a valid token to access this endpoint. Requests lacking valid authentication will be rejected.

**Permissions:** Users must have the necessary permissions to delete assets. Typically, these are 'delete' permissions on the assets they aim to remove. Attempts to delete assets without the appropriate permissions will be denied.

Upon receiving a deletion request, the \`removeRest\` handler initiates the \`remove\` action, which takes in the asset IDs to be deleted from the client's request. It first checks the user's permissions to ensure they are authorized to perform the deletion. If the permission checks pass, it proceeds to call the \`remove\` method from the \`assets\` core, which performs the actual deletion operation on the database. After the removal process completes successfully, the handler responds with an acknowledgment of deletion or an error message if something went wrong during the process.`,
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
