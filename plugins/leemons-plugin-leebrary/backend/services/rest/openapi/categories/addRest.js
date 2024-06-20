const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add a new category to the library system',
  description: `This endpoint is designed to facilitate the addition of new categories into the library system. It allows for the organization and classification of various resources within the library, enhancing the ease and efficiency of resource retrieval and management.

**Authentication:** User authentication is necessary to ensure a secure interaction with the endpoint. Only authenticated users can initiate the addition of new categories.

**Permissions:** The user must have the 'admin' role or equivalent permissions to add new categories. This ensures that only authorized personnel can make changes to the category structure.

Upon receiving the request, the \`addRest\` handler first validates the provided category data against the defined schema. If validation passes, it proceeds to invoke the \`add\` method within the \`categories\` core module. This method checks for the existence of the category to avoid duplicates using the \`exists\` function from the same module. If the category does not exist, it is added to the database, and a confirmation is returned to the user. If the category already exists, the endpoint responds with an error message stating that the category cannot be duplicated.`,
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
