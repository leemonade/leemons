const { schema } = require('./schemas/response/getDocumentRest');
const { schema: xRequest } = require('./schemas/request/getDocumentRest');

const openapi = {
  summary: 'Fetches document details based on provided parameters',
  description: `This endpoint is responsible for retrieving detailed information about a specific document. It handles the request by identifying a document using given parameters and returns comprehensive details about the document to the requesting user.

**Authentication:** Users need to be authenticated to request the document details. If authentication information is missing or incorrect, the endpoint will deny access.

**Permissions:** This endpoint requires users to have specific roles or permissions set to access the document details. The necessary permissions depend on the document’s confidentiality and user's access rights within the system.

Upon receiving a request, the \`getDocumentRest\` handler initiates the process by calling the \`getDocument\` function from the document core module. The function uses parameters passed in the request to query the database and retrieve the document data. This interaction involves validating the request data, ensuring proper authentication and authorization, and seamlessly handling data retrieval from the database. Following successful data acquisition, the function then formats the data appropriately and sends it back to the client as a JSON object, providing a clear and structured representation of the document.`,
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
