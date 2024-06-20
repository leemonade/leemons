const { schema } = require('./schemas/response/saveDocumentRest');
const { schema: xRequest } = require('./schemas/request/saveDocumentRest');

const openapi = {
  summary: 'Saves a document with the provided content updates',
  description: `This endpoint allows users to save modifications to a document within the application. It accepts updated contents for an existing document, including text changes, format adjustments, and other related updates typically necessary for content management through a document editor interface.

**Authentication:** Users must be authenticated to update documents. Proper session tokens must be included in the request to validate user identity and access rights.

**Permissions:** Users need specific editing permissions for the document they attempt to modify. Without appropriate permissions, the request will be denied, safeguarding the document against unauthorized changes.

Upon receiving the request, the endpoint invokes the \`saveDocument\` function from the \`Document\` core, which manages the document update process. The method receives the content updates along with a document identifier for accurate targeting within the database. It carries out a series of checks to confirm the user's rights to edit the document, then proceeds to update the document's entries in the database as specified in the request payload. Once the updates are successfully applied, the server responds with a confirmation of the changes, detailing the updated document's status and any relevant metadata associated with the modifications.`,
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
