const { schema } = require('./schemas/response/detailProgramRest');
const { schema: xRequest } = require('./schemas/request/detailProgramRest');

const openapi = {
  summary: 'Details of a specific academic program',
  description: `This endpoint retrieves comprehensive details of an academic program, including its structure, associated courses, subjects, and any other relevant information. It aims to provide users with a complete view of an academic program's configuration and offerings.

**Authentication:** User must be authenticated to access the details of the academic program. Without proper authentication, the request will not proceed further.

**Permissions:** Access to this endpoint is restricted to users who have permissions to view academic program details. Typically, this includes educational administrators, academic staff, or students who are part of the specified program.

Upon receiving a request, the endpoint first validates the user authentication and checks for the necessary permissions. If validation is successful, it calls the \`getDetailedProgram\` method in the academic portfolio's program service. This method orchestrates several sub-methods to gather information about programs, their courses, subjects, and associated class groups from various parts of the database. It assembles all this data into a structured format that effectively represents the hierarchy and sequence of educational components within the program. The final response includes detailed information about the program, structured in a clear, readable JSON format to the client.`,
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
