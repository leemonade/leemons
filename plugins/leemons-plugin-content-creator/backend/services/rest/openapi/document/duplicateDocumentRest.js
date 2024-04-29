const { schema } = require('./schemas/response/duplicateDocumentRest');
const { schema: xRequest } = require('./schemas/request/duplicateDocumentRest');

const openapi = {
  summary: 'Duplicates a specific document within the content system',
  description: `This endpoint is responsible for creating a duplicate copy of a specified document. The process involves copying the document’s data and metadata, ensuring that the new document retains the essential characteristics of the original while being a distinct entity in the system.

**Authentication:** User authentication is required to access this endpoint. Users must provide valid session credentials to ensure they are allowed to duplicate documents.

**Permissions:** The user must have the 'duplicate_document' permission assigned to their role. Without this permission, the request to duplicate a document will be denied.

The duplication process begins by invoking the \`duplicateDocument\` function located in the backend core document logic. This function receives a document ID from the request's parameters and accesses the original document from the database. After retrieving the document, it performs a deep copy, including all related data such as attached files and metadata. The new copy is then saved under a new document ID with a reference to its origin. The final response from this endpoint provides the client with the ID of the newly duplicated document, confirming the successful completion of the operation.`,
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
