const { schema } = require('./schemas/response/listGradesRest');
const { schema: xRequest } = require('./schemas/request/listGradesRest');

const openapi = {
  summary: 'List all grades relevant to the current user',
  description: `This endpoint provides a list of grades that are relevant to the current user. The output includes grades from courses the user teaches or is enrolled in, as well as those shared with the user within the educational platform.

**Authentication:** User authentication is required to access the grades. Access to this endpoint is denied if the user is not authenticated or if the authentication token is invalid.

**Permissions:** Specific permissions might be required to access different sets of grades. The user must have the appropriate permissions to view grades for courses they are not directly teaching or enrolled in.

Upon receiving a request, the handler calls the \`listGrades\` method in the grades core logic. This method uses context information (\`ctx\`) carried with the request to determine the user's identity and roles. It then queries the database to retrieve relevant grade records, applying any necessary permission checks to ensure the user can only access grades they are allowed to view. Finally, the queried grades are formatted as required and sent back to the user in a structured JSON response.`,
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
