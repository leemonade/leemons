const { schema } = require('./schemas/response/shareDocumentRest');
const { schema: xRequest } = require('./schemas/request/shareDocumentRest');

const openapi = {
  summary: 'Share a content document with specified users or groups',
  description: `This endpoint allows sharing a specific content document with one or more users or groups within the platform. The sharing mechanism updates the document's sharing settings to grant access to the specified entities.

**Authentication:** Users need to be authenticated and possess the necessary session credentials to invoke this sharing action. Without proper authentication, the request will not be processed.

**Permissions:** The user must have ownership or sharing permissions that allow them to modify the document's sharing settings. Attempts to share documents without these permissions will be blocked.

Upon receiving a sharing request, the \`shareDocumentRest\` handler initiates the process by validating the user's session and permissions. It then constructs a share request object, which includes details about the document to be shared and the intended recipients (users or groups). This object is passed on to the \`shareDocument\` core method found in \`shareDocument.js\`. The core method handles the logic for updating the document's access controls within the database, ensuring proper sharing according to defined rules and permissions. Once the sharing operation is successful, the endpoint sends back a confirmation response, which may include details of the sharing update or a simple success message to the requester.`,
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
