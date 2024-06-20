const { schema } = require('./schemas/response/listGradesRest');
const { schema: xRequest } = require('./schemas/request/listGradesRest');

const openapi = {
  summary: 'List all grades available in the system',
  description: `This endpoint lists all grades currently available within the system. It allows the user to retrieve a comprehensive list of grade records, which include both active and archived grades.

**Authentication:** Authentication is required to access this endpoint. Users need to provide a valid authentication token in their request headers to verify their identity.

**Permissions:** Users need to have the 'view_grades' permission to access this endpoint. This ensures that only users with the appropriate role or permission settings can view the list of grades.

Upon receiving a request, the \`listGradesRest\` handler calls the \`listGrades\` method from the Grades core module. This method queries the database to fetch all grade records, including details like grade name, associated tags, and scale. The response from the database is then formatted and returned as a JSON array, which includes all the pertinent details about each grade. The handler ensures that the response is structured properly and includes any necessary metadata before sending it back to the client.`,
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
