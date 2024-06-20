const { schema } = require('./schemas/response/shareDocumentRest');
const { schema: xRequest } = require('./schemas/request/shareDocumentRest');

const openapi = {
  summary: 'Share a document with specified users or groups',
  description: `This endpoint enables a user to share a specific document with one or more users or groups within the platform. The sharing process involves specifying the document ID, the target users or groups, and the permissions that those entities will have on the shared document.

**Authentication:** User authentication is required to ensure that only authorized users can share documents. Unauthorized attempts will be blocked and logged.

**Permissions:** The user must have ownership or sharing permissions with edit rights on the document to share it with others.

The process starts in the \`shareDocumentRest\` handler, which calls the \`shareDocument\` function from the core document module. This function takes input parameters such as document IDs, user or group IDs, and sharing permissions. It checks the user's rights over the document and then updates the database to reflect the new sharing settings. Internally, this may trigger notifications or logs to inform relevant users about the change in document access. The result of the operation is then formatted and returned as a standard JSON response, indicating the success or failure of the sharing request.`,
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
