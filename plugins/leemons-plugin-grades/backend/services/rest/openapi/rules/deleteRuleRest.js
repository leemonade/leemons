const { schema } = require('./schemas/response/deleteRuleRest');
const { schema: xRequest } = require('./schemas/request/deleteRuleRest');

const openapi = {
  summary: 'Deletes a specific grading rule',
  description: `This endpoint removes a grading rule from the system identified by its unique identifier. The operation cascades to associated condition groups and conditions, ensuring that all related data is also removed.

**Authentication:** Users need to be authenticated to execute this deletion operation. Unauthenticated requests will be rejected, and the user will be prompted to log in.

**Permissions:** Appropriate permissions are required to delete grading rules. Users without sufficient privileges will not be able to carry out this operation, and the request will result in an error.

Upon receiving a delete request, the \`deleteRuleRest\` action is initiated within the \`rules.rest.js\` service file. The request must contain the unique identifier of the grading rule to be deleted. This invokes the \`removeRule\` method from the \`rules\` core module, which is responsible for the deletion of the rule from the database. Following this, it triggers \`removeConditionGroupsByRule\` and \`removeConditionsByRule\` methods to ensure that all condition groups and conditions tied to the rule are also removed. This maintains data integrity and prevents orphaned records. The process concludes with the endpoint returning a confirmation of deletion or an error message if the process is unsuccessful.`,
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
