const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'Lists all family entities accessible to the user',
  description: `This endpoint provides a comprehensive list of family entities that the user can access within the application. It consolidates data from various sources and presents a unified view to simplify user interactions with family records.

**Authentication:** User authentication is required to ensure secure access to the family data. Only authorized users can retrieve the list based on their credentials.

**Permissions:** The user must possess the appropriate permissions to view family entities. These permissions help in enforcing data security and access rights specific to user roles within the application.

Following authentication and permission checks, the \`listRest\` controller in the family plugin initializes by calling the \`list\` method located in \`families/index.js\`. This method further interacts with underlying service layers to fetch and organize data pertinent to the families. The retrieval process takes into consideration the user's role and permissions to filter and return only those family records that the user is authorized to view. The final output is formatted and sent back as JSON data, which includes details of each family entity accessible to the user.`,
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
