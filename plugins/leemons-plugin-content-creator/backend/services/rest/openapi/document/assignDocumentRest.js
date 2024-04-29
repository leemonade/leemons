const { schema } = require('./schemas/response/assignDocumentRest');
const { schema: xRequest } = require('./schemas/request/assignDocumentRest');

const openapi = {
  summary: 'Assign document to a user or group',
  description: `This endpoint is responsible for assigning a specific document to either a user or a group. The operation involves validating the document's availability and checking if the specified recipient is eligible to receive the document. The assignment is recorded in the system for tracking and management purposes.

**Authentication:** User authentication is required to ensure that only authorized users can assign documents. An unauthenticated request will be rejected, prompting for valid user credentials.

**Permissions:** The user must have 'document-assign' permission to perform this operation. Without the necessary permissions, the operation will not be executed, and an access denied message will be returned.

The flow starts with the validation of the provided document ID and recipient details through the \`assignDocument\` core method. If validation succeeds, the document's status is updated to reflect the new assignment, and pertinent details are recorded in the database. The recipient, whether a user or a group, is then notified of the document assignment. This entire process ensures a comprehensive approach to document management and access control within the system.`,
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
