const { schema } = require('./schemas/response/saveDocumentRest');
const { schema: xRequest } = require('./schemas/request/saveDocumentRest');

const openapi = {
  summary: 'Save a new document or update an existing one',
  description: `This endpoint allows for both the creation of a new document or the update of an existing one within the content creator plugin. Once the request is made, the endpoint will determine the appropriate action based on the provided document data and execute it accordingly.

**Authentication:** The users must be authenticated to interact with documents. An invalid or missing authentication token will result in denial of access to this endpoint.

**Permissions:** Users need appropriate permissions to either create a new document or update an existing one. The required permissions depend on the user's role and the specific document they are attempting to modify.

Upon receiving a request, this endpoint initially validates the provided document data against predefined schemas to ensure adherence to the correct format and completeness. In case of a new document, the \`createDocument\` method from the document core is invoked, which handles the creation of the document in the database. If it is an update operation, the \`updateDocument\` method is called instead, which locates the existing document and applies the changes. Both processes encapsulate business logic validations, persistence operations, and error handling to ensure data integrity and proper response formation. The endpoint eventually responds with the details of the saved or updated document, including any relevant metadata.`,
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
