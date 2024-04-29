const {
  schema,
} = require('./schemas/response/duplicateGroupWithClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/duplicateGroupWithClassesUnderNodeTreeRest');

const openapi = {
  summary:
    'Duplicate a group along with its associated classes under a specific node tree',
  description: `This endpoint duplicates a specified group along with its classes under a designated node tree within the academic portfolio system. The duplication process includes creating a complete copy of the group's structure, the associated classes, and any relational data linked under the specified node tree.

**Authentication:** Users must be authenticated to initiate the duplication of groups and classes. A lack of authentication or an invalid token will prevent access to this endpoint.

**Permissions:** The user must have the 'admin' role or specific duplication rights associated with their account to perform this task. Without sufficient permissions, the operation will be blocked with an access denied error.

The endpoint interacts with multiple backend services to accomplish the group and class duplication task. Initially, the process begins by validating user authentication and checking for necessary permissions in the context of the transaction. Upon successful validation, the \`duplicateGroupWithClassesUnderNodeTreeByIds\` function is invoked, which orchestrates the retrieval and duplication of the group and its classes based on the specified node IDs in the request. This involves deep copying of all related data structures and ensuring that relational integrity is maintained throughout the database. Finally, after the duplication process, the outcome is returned to the user, indicating success or providing error messages regarding any issues encountered during the operation.`,
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
