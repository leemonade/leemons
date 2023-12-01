const { schema } = require('./schemas/response/duplicateDocumentRest');
const { schema: xRequest } = require('./schemas/request/duplicateDocumentRest');

const openapi = {
  // summary: "Summary",
  description: `
{
  "summary": "Duplicate a specific document",
  "description": "This endpoint is responsible for creating a duplicate copy of a specified document. It allows users to replicate an existing document, typically for the purpose of creating a template or reusing the document structure and content with different modifications.

**Authentication:** The user must be authenticated to duplicate a document. If the user's session is not authenticated, the request to duplicate the document will be rejected.

**Permissions:** Users need to have duplication permissions on the document they are trying to duplicate. Without the required permissions, the request will be denied, ensuring that only authorized users can replicate documents.

The duplication process begins when the 'duplicateDocumentRest' action is triggered in the service exposed by 'document.rest.js'. The action takes in the identifier of the document to be duplicated and calls the 'duplicateDocument' method that's in the 'document' core, found in 'duplicateDocument.js'. This method handles the logic of creating a copy of the existing document, including its content and any associated metadata. It ensures that all references to the original document are maintained or adjusted as necessary to prevent linkage issues. Upon successful duplication, the new document's details are returned in the response, typically including the new document's identifier and any other relevant information that the consumer of the API needs to know."
}
`,
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
