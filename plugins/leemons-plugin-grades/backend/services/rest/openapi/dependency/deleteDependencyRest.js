const { schema } = require('./schemas/response/deleteDependencyRest');
const { schema: xRequest } = require('./schemas/request/deleteDependencyRest');

const openapi = {
  summary: 'Removes specified dependencies and their related components',
  description: `This endpoint facilitates the removal of dependencies along with their associated elements such as condition groups and conditions associated with any grading rule. Upon successful deletion, it ensures the integrity and cleanliness of the data by cascading the deletion process to related items.

**Authentication:** Users need to be authenticated to perform this operation. Unauthorized access will be prevented, ensuring that only authenticated requests proceed to perform deletions.

**Permissions:** Appropriate permissions are required to access this endpoint. The user must have administrative rights or specific permissions set to manipulate grade-related configurations to use this endpoint.

The process begins by the controller handling the request to delete a specific dependency. It calls the \`removeDependency\` method, which first checks for the existence of the dependency. It then proceeds to invoke additional methods like \`removeConditionGroupsByRule\` and \`removeConditionsByRule\` from respective modules to ensure all associated data is comprehensively removed. This methodical deletion prevents any orphaned entries and maintains the consistency of the database integrity. The final response confirms the successful deletion of all entities related to the dependency.`,
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
