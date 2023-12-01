const { schema } = require('./schemas/response/postKnowledgeRest');
const { schema: xRequest } = require('./schemas/request/postKnowledgeRest');

const openapi = {
  summary: 'Add new academic knowledge item to the system',
  description: `This endpoint is responsible for adding a new academic knowledge item into the system. The knowledge item can be a set of skills, theories, or any academic concept that is intended to be part of the academic curriculum.

**Authentication:** This endpoint requires the user to be authenticated. If the user's credentials are not provided or are incorrect, the request will be rejected.

**Permissions:** The user must have the necessary permissions to create new academic knowledge items. Typically, this would be an administrative or academic management role.

Upon receiving a request, the endpoint processes inputs through validation checks. If validation succeeds, it triggers the \`addKnowledge\` function within the \`knowledges\` core to store the new item. It interacts with a database to save the knowledge details, ensuring that the data conforms to predefined schemas and academic structures. Post-operation, it returns a success message with the created item's details or an error message if the operation fails.`,
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
