const { schema } = require('./schemas/response/postNodeLevelsRest');
const { schema: xRequest } = require('./schemas/request/postNodeLevelsRest');

const openapi = {
  summary: 'Add multiple node levels to a specific curriculum',
  description: `This endpoint is responsible for adding new node levels to a given curriculum within the system. The node levels represent different hierarchical stages or steps in a curriculum's structure, and this action allows for the bulk creation of these elements.

**Authentication:** Users must be authenticated to create new node levels. Access to this endpoint is managed through user sessions or auth tokens that verify the user's identity.

**Permissions:** Users must have the 'manage_curriculum' permission to add node levels. Without sufficient privileges, the request will be rejected, ensuring that only authorized personnel can make changes to the curriculum structure.

Upon receiving a request to create new node levels, the handler first validates the provided data against a schema using the \`getNodeLevelSchema\` function. If validation passes, the \`addNodeLevels\` core method is called with the validated data, which in turn interacts with the database to insert the new node levels. Finally, the endpoint responds with the details of the created node levels or an error message if the operation failed.`,
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
