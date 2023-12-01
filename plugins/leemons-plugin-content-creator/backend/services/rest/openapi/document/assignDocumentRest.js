const { schema } = require('./schemas/response/assignDocumentRest');
const { schema: xRequest } = require('./schemas/request/assignDocumentRest');

const openapi = {
  summary: 'Assigns a document to the specified target',
  description: `This endpoint handles the assignment of a particular document to a target entity within the platform. It involves linking a document to a user, a group, or another entity, thereby granting access or establishing ownership relations between documents and entities.

**Authentication:** User authentication is required to ensure that only authorized users can assign documents. Assigning documents to entities without proper authentication will be rejected.

**Permissions:** The user must possess adequate permissions to assign documents. Without the necessary permissions, the action will be prohibited, and the user will be informed of the access restriction.

Upon receiving a request, the endpoint first validates the user's credentials and permissions. If validation is successful, it invokes the \`assignDocument\` method from the \`document\` core, which handles the business logic for document assignments. This method receives the document details and the target information from the request body and processes the assignment. The \`assignDocument\` function performs the necessary actions, such as updating database records to reflect the new ownership or access links. After successful completion, the endpoint returns a confirmation message or the updated document details in the HTTP response.`,
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
