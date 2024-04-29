const { schema } = require('./schemas/response/getClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/getClassesUnderNodeTreeRest');

const openapi = {
  summary: 'Retrieve classes under a specific node tree',
  description: `This endpoint fetches all class details located under a specified node tree hierarchy within the academic system. It processes the node tree structure and lists all classes linked under the nodes encompassed by the specified root node.

**Authentication:** User authentication is mandatory to access this endpoint. Users without a valid session or authentication token will be denied access.

**Permissions:** Necessary permissions include access to the academic program data. Users must have roles that grant visibility or management of class information under the specified node hierarchy.

Upon receiving a request, this endpoint initiates by calling the \`getClassesUnderNodeTree\` function from the \`Common\` core module, submitting the node ID and leveraging a recursive search to trace through the node tree hierarchy. The operation accesses interconnected nodes and aggregates classes belonging to each node. The action leverages database queries to fetch and compile lists of classes, ensuring the returning data is constructed accurately based on user permissions and authenticated session. The endpoint concludes by packaging this list into a JSON response format, providing a consolidated view of class data structured under the queried node tree.`,
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
