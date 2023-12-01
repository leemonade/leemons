const { schema } = require('./schemas/response/duplicateGroupRest');
const { schema: xRequest } = require('./schemas/request/duplicateGroupRest');

const openapi = {
  summary: 'Duplicate an academic group with all related entities',
  description: `This endpoint duplicates a specified academic group including its classes, students, and associated entities, creating a new group with identical attributes but a distinct identifier to enable parallel or successive academic scenarios.

**Authentication:** This endpoint requires the user to be authenticated. Users who are not authenticated cannot duplicate groups and will receive an unauthorized access error upon attempting to invoke this endpoint.

**Permissions:** Authorization is enforced; the user must have permission to manage academic groups. Without the required permissions, the operation will not be executed and an access violation notification will be returned.

Upon invocation, the \`duplicateGroupRest\` handler initiates the \`duplicateGroup\` method from the \`GroupService\`. It retrieves the group data based on the provided group ID, then performs a deep copy of the group including all associated classes and other related academic entities. To maintain unique identifiers, new IDs are generated for each duplicated entity. This process ensures that the newly created group is a clone of the original while preventing any conflicts within the system. The response from this handler confirms the successful duplication of the group along with basic metadata about the cloned group.`,
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
