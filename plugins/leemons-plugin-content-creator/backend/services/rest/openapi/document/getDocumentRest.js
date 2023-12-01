const { schema } = require('./schemas/response/getDocumentRest');
const { schema: xRequest } = require('./schemas/request/getDocumentRest');

const openapi = {
  summary: 'Retrieve specific document details',
  description: `This endpoint is responsible for fetching and returning the details of a specific document by its unique identifier. It ensures that users can retrieve the content and metadata associated with a document within the content creation platform.

**Authentication:** Users need to be authenticated and have a valid session to request document details. Actions from unauthenticated sessions will not be permitted, and the user will be prompted to log in.

**Permissions:** Access to this endpoint requires specific permissions related to document viewing or management. Users without the appropriate document access rights will receive an insufficient permissions error.

Upon receiving a request, the 'getDocumentRest' handler in the 'document.rest.js' file triggers a series of steps to serve the request. Initially, it calls the 'getDocument' method in the 'document' core, with the document identifier passed through the API call's query or path parameter. The 'getDocument' method then executes the retrieval logic, interacting with the database to locate and return the requested document. This process involves verifying the user's permissions to access the document and ensuring all necessary data is correctly compiled and formatted. Finally, the document details are returned to the requesting client as a JSON object, encapsulating both the content and associated metadata.`,
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
