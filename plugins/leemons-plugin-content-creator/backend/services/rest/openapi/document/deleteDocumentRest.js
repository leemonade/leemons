const { schema } = require('./schemas/response/deleteDocumentRest');
const { schema: xRequest } = require('./schemas/request/deleteDocumentRest');

const openapi = {
  summary: 'Delete a specific content document',
  description: `This endpoint allows the deletion of a document identified by its unique identifier. The deletion process involves the removal of the document record from the database and potentially any associated metadata or content.

**Authentication:** The user must be authenticated to perform deletion operations. Unauthorized requests will be rejected.

**Permissions:** The user needs to have the 'document.delete' permission to delete a document. Without the necessary permission, the operation will not be executed and an error response will be returned.

Upon receiving a delete request, the handler initially verifies user authentication and checks if the user has the required permission. Once authorized, it invokes the \`deleteDocument\` function from the \`document\` core module. This function takes the document ID from the request parameters, performs the necessary operations to securely delete the document from the system, and ensures that all references to the document are also removed. After successful deletion, it returns a confirmation message indicating that the document has been removed, otherwise, it throws an appropriate error detailing the issue encountered.`,
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
