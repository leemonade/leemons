const { schema } = require('./schemas/response/getTreeRest');
const { schema: xRequest } = require('./schemas/request/getTreeRest');

const openapi = {
  summary: 'Builds the complete tree structure of academic elements',
  description: `This endpoint constructs a hierarchical tree of academic elements, such as subjects, courses, and programs, providing a structured view of their relationships and dependencies within the educational institution.

**Authentication:** Users must be authenticated to retrieve the tree structure. Unauthorized access will be prevented, ensuring that only valid users can perform this action.

**Permissions:** Appropriate permissions are necessary to access this endpoint. Users need to have rights to view the academic elements that are part of the tree. Without sufficient permissions, the request will be rejected.

Upon receiving a request, the \`getTreeRest\` handler invokes the underlying \`getTree\` function from the \`common\` core. It processes the input data, typically consisting of the identifiers for the starting points of the tree. It then interacts with multiple services and models to recursively fetch and assemble academic objects, such as subjects, programs, and their nested relationships. The final outcome is a comprehensive JSON structure representing the entire academic tree, which is then sent back to the requester in the HTTP response.`,
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
