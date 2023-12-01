const { schema } = require('./schemas/response/putKnowledgeRest');
const { schema: xRequest } = require('./schemas/request/putKnowledgeRest');

const openapi = {
  summary: 'Updates knowledge item within the academic portfolio',
  description: `This endpoint allows for updating a specific knowledge item by its ID as part of the academic portfolio management. It expects to receive the updates knowledge item's properties and applies the changes to the existing record in the database.

**Authentication:** Users must be authenticated to update knowledge items. Without proper authentication, the request will be rejected.

**Permissions:** Users need to have the 'knowledge_edit' permission to perform updates on knowledge items. If a user attempts to update a knowledge item without the required permission, the request will fail with an authorization error.

Upon receiving the request, the handler first verifies the user's authentication and authorization. It then invokes the \`updateKnowledge\` function from the \`knowledges\` core module while passing along the knowledge ID and the updated data from the request body. The \`updateKnowledge\` function handles the database operation to update the specific knowledge record. After successful execution, the endpoint responds with the updated knowledge information, confirming the changes have been successfully applied.`,
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
