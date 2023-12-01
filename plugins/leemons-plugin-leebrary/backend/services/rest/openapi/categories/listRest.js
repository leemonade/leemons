const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List all categories available in the leebrary',
  description: `This endpoint lists all the categories defined within the leebrary system that can be used to categorize various resources. The results include all category names and details, providing a comprehensive overview of the categorization structure.

**Authentication:** The user needs to be logged in to view the list of categories. An authentication check is performed to ensure that a valid user session exists before providing access to the category data.

**Permissions:** Required permissions for accessing this endpoint may include specific roles or privileges related to category management or viewing. Users without sufficient permission will not be able to retrieve the list of categories.

Upon receiving a request, the \`listRest\` handler calls the \`list\` action from the \`categories\` core, which internally invokes the \`list\` method to retrieve the categories from the database. This process involves a query to fetch all existing categories with their respective details. The final response includes a formatted list of categories, presented to the user in a structured JSON format.`,
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
