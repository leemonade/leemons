const { schema } = require('./schemas/response/deleteRuleRest');
const { schema: xRequest } = require('./schemas/request/deleteRuleRest');

const openapi = {
  summary: 'Delete a specific grading rule',
  description: `This endpoint deletes a grading rule by its unique identifier. Once deleted, all associated condition groups and conditions tied to the rule are also removed from the system, ensuring that no orphan data remains.

**Authentication:** The user must be authenticated to proceed with the deletion of a grading rule. Without proper authentication, the request will be rejected.

**Permissions:** Users require administrative rights or specific permissions related to grading system management to delete grading rules. Insufficient permissions will result in access being denied.

The delete operation begins by the \`deleteRuleRest\` method intercepting the request with a specific rule ID. The method then calls the \`removeRule\` function in the backend/core rules, which handles the main deletion logic. This function sequentially executes \`removeConditionGroupsByRule\` and \`removeConditionsByRule\` to ensure all related entries are purged effectively. Post deletion, the method finalizes by sending a success response back to the client, confirming the completion of the deletion process.`,
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
