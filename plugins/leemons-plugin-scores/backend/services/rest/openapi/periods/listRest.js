const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List academic periods',
  description: `This endpoint retrieves a list of academic periods within the educational platform. The data includes periods such as semesters, terms, or quarters during which educational activities take place.

**Authentication:** Users need to be authenticated to request the list of academic periods. Unauthorized access will be prevented, ensuring that only authenticated users can retrieve the data.

**Permissions:** This endpoint requires specific permissions that determine whether the user can list all academic periods or only those they are entitled to view, based on roles like administrators, teachers, or students.

Upon receiving a request, the handler first checks the user's authentication status and permissions. Assuming the user is authorized, the handler then calls the \`listPeriods\` method from the \`periods\` core module. This method interacts with the internal system or database to gather information about the academic periods. It compiles a comprehensive list that may take into account the user's role, such as showing only relevant periods for a student or all periods to an administrator. Once the data is fetched, it's formatted accordingly and sent back to the client in a structured JSON response.`,
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
