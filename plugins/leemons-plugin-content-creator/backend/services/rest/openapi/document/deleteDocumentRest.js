const { schema } = require('./schemas/response/deleteDocumentRest');
const { schema: xRequest } = require('./schemas/request/deleteDocumentRest');

const openapi = {
  summary: 'Delete a specified document',
  description: `This endpoint is responsible for deleting a specific document identified by its unique ID. The operation entails removing the document from the database and ensuring that all associated data such as references or shared links are also appropriately handled.

**Authentication:** Users need to be authenticated to execute this deletion. The process checks for a valid user session and compares the user's identity against the ownership or permission attributes of the document to be deleted.

**Permissions:** The user must have administrative or specific rights over the document to execute a deletion. Permissions checks are implemented to ensure that only authorized users can delete documents.

The flow initiates when the \`deleteDocument\` action is called in the \`document.rest.js\` service file. This service then interacts with the \`deleteDocument\` core method defined in \`deleteDocument.js\`. The core method handles the logic for checking permissions, verifying document existence, and executing the delete operation in the database. Detailed error handling is implemented to manage cases like non-existent documents or insufficient permissions, ensuring the client receives clear and explanatory feedback. The method concludes by sending a response back to the client confirming the deletion or reporting any issues that occurred during the process.`,
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
