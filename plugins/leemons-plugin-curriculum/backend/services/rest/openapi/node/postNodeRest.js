const { schema } = require('./schemas/response/postNodeRest');
const { schema: xRequest } = require('./schemas/request/postNodeRest');

const openapi = {
  summary: 'Add a new curriculum node',
  description: `This endpoint creates a new node within a specific curriculum structure. It receives the node's details in the request body and appends it to the curriculum's existing node hierarchy.

**Authentication:** Users must be authenticated and have a valid session to create a curriculum node. Requests without proper authentication will be denied.

**Permissions:** Users need to have the 'curriculum.create' permission to add a new node to the curriculum. Without the necessary permissions, the request will be rejected with an authorization error.

Upon request, the handler validates the input data against the predefined curriculum node schema. If validation passes, it invokes the \`addNode\` method from the curriculum core, which handles the logic of inserting the new node into the curriculum structure. The method involves updating the nodes' tree, ensuring correct placement, and establishing parent-child relationships. Upon successful addition, the system triggers the \`reloadNodeFullNamesForCurriculum\` method to update the full names of nodes and maintain consistency across the curriculum. Finally, the response includes the details of the newly added node, confirming the successful operation.`,
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
