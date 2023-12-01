const { schema } = require('./schemas/response/saveNodeRest');
const { schema: xRequest } = require('./schemas/request/saveNodeRest');

const openapi = {
  summary: 'Save a new or update an existing curriculum node.',
  description: `This endpoint is responsible for creating a new curriculum node or updating an existing one. It handles the entire lifecycle of a curriculum node, including the addition of new content, updating existing content, and ensuring that all references and dependencies are correctly managed.

**Authentication:** Users must be logged in to submit changes to curriculum nodes. Unauthorized users will be unable to access this endpoint.

**Permissions:** Appropriate permissions are required to either create a new node or update an existing one. The level of access may vary based on the user's role within the system, and permission checks will be performed to ensure that users can only perform actions they're authorized for.

Upon receiving a request, the \`saveNodeRest\` handler begins by validating the provided data against the node schema. If the validation passes, it calls the \`saveNode\` method from the \`nodes\` core, which conducts the necessary database operations. Depending on whether the node data includes an identifier, the \`saveNode\` method determines if this is a new node to be created or an existing node to be updated. It ensures that any relationships with other nodes are appropriately handled and that the data conforms to the curriculum's structure. Once the operation is complete, the endpoint responds with the resulting node data, including any updates or a unique identifier if a new node was created.`,
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
