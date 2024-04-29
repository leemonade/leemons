const { schema } = require('./schemas/response/listProgramRest');
const { schema: xRequest } = require('./schemas/request/listProgramRest');

const openapi = {
  summary: 'List all academic programs available to a user',
  description: `This endpoint lists all academic programs that are accessible based on the user's role or permissions within the educational platform. It typically filters and returns a collection of programs that the user is either enrolled in or has administrative access to.

**Authentication:** User authentication is required to access the list of programs. Users must provide valid authentication credentials to proceed. An insufficient or missing authentication token will restrict access to the program's information.

**Permissions:** Users need specific permissions related to viewing academic programs. Typically, these permissions include roles like academic staff, administrator, or student permissions that allow them to view detailed program data.

Upon receiving a request, the \`listPrograms\` method in the \`programs\` core is called. This method verifies the context of the user's request, checking for authentication and necessary permissions. Based on the authenticated user's role and permissions, it queries the database for accessible academic programs. The method then processes the received data, filtering and structuring the programs into a suitable format for response. Finally, a structured list of programs is sent back to the user in JSON format, encapsulating key details like program names, descriptions, and eligibility criteria.`,
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
