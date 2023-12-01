const { schema } = require('./schemas/response/deleteDependencyRest');
const { schema: xRequest } = require('./schemas/request/deleteDependencyRest');

const openapi = {
  summary: 'Delete a specific Grade Dependency',
  description: `This endpoint allows for the removal of a specific grade dependency from the system. It handles the deletion request and ensures the removal of any related data within the grade management system.

**Authentication:** Users need to be authenticated to send a deletion request for a grade dependency. Unauthorized requests will be rejected.

**Permissions:** Adequate permissions are required to delete a grade dependency. Users without sufficient privileges will be unable to perform this action.

The deletion process initiated by this endpoint begins with a call to the \`deleteDependencyRest\` method. This action receives an identifier for the targeted grade dependency as a parameter. Upon validation, it proceeds to invoke the \`removeRule\` functionality from the rules core, ensuring that any associated rule is properly deleted. In tandem, related condition groups and conditions that are linked to the rule are methodically eradicated by invoking \`removeConditionGroupsByRule\` and \`removeConditionsByRule\` respectively. Each step is carefully executed to maintain referential integrity within the system, with the final outcome relayed back to the client as confirmation of the deletion.`,
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
