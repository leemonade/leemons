const { schema } = require('./schemas/response/programSubstagesRest');
const { schema: xRequest } = require('./schemas/request/programSubstagesRest');

const openapi = {
  summary: 'Manage academic program sub-stages',
  description: `This endpoint manages the sub-stages of an academic program. It typically involves updating, retrieving, or deleting details related to various sub-stages within a specified academic program in the database.

**Authentication:** The user must be authenticated to modify or access sub-stage information. Authentication ensures that only authorized users can manage such sensitive educational data.

**Permissions:** The endpoint requires specific academic management permissions. Users need to have roles that include rights to modify educational structures or privileges to view program details.

The controller typically interacts with multiple core methods to handle the request effectively. Initially, it might check user authentication and authorization, followed by either fetching data using \`getProgramSubstages\` from the \`programs\` core or updating and deleting sub-stage information. This process may also include validation of input data to ensure integrity and appropriateness according to academic standards and database schemas. The results or confirmations are then sent back to the user, encapsulated in the HTTP response.`,
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
