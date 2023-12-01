const { schema } = require('./schemas/response/listProgramRest');
const { schema: xRequest } = require('./schemas/request/listProgramRest');

const openapi = {
  summary: 'Lists academic programs available to the user',
  description: `This endpoint lists all academic programs that the user has access to view within the academic portfolio system. It includes programs that the user is enrolled in, has completed, or has permissions to manage.

**Authentication:** Access to this endpoint requires the user to be authenticated. An unauthenticated request will be denied.

**Permissions:** The user must have permission to view academic programs. Lack of the required permission will prevent the user from accessing program information.

After receiving the request, the handler uses the \`listPrograms\` method from the \`programs\` core service to retrieve the list of program identifiers available for the current user via the \`getUserProgramIds\` function. This method accounts for the user's roles and permissions to determine which academic program information is accessible. The list of program IDs obtained is then used to retrieve the full details of each accessible program, resulting in a comprehensive response detailing the academic programs this user can access. The final response is formatted as JSON, which includes detailed information about each program.`,
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
