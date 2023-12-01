const { schema } = require('./schemas/response/getClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/getClassesUnderNodeTreeRest');

const openapi = {
  summary: 'List all classes under a specific node tree',
  description: `This endpoint lists all academic classes that are associated with a specified node tree within the academic structure. It's targeted to provide a comprehensive overview of the classes nested under specific organizational units or grouping categories.

**Authentication:** Users need to be authenticated to access the list of classes linked to a node tree, ensuring secure and authorized access to academic structural data.

**Permissions:** Access to this endpoint requires specific permission to view the academic portfolio details, typically granted to educational administrators or staff in charge of academic program management.

Upon receiving the request, the handler for \`getClassesUnderNodeTreeRest\` utilizes the \`getClassesUnderNodeTree\` method from the common core, passing the relevant parameters which include the identifiers for the node tree. This method executes a series of database queries to gather all the classes within the specified node tree, taking into account the hierarchy and relationships between different nodes. The final result, which is an aggregation of all the relevant classes, is then formatted accordingly and sent back as a JSON response, providing the client with detailed information about the classes available under the selected node tree structure.`,
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
