const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'List accessible assignables for a user',
  description: `This endpoint provides a list of assignables that the currently authenticated user has the right to access. It takes into account the user's roles and permissions to compile a list of available tasks, homework, projects, or other assignable items.

**Authentication:** User authentication is mandatory to ensure that each user receives the correct list of accessible assignables. Without valid authentication, access to this information will be denied.

**Permissions:** Specific permissions are required to access this endpoint. Users must have been granted the appropriate permissions to view or manage assignables corresponding to their roles in the educational or organizational structure.

Upon receiving a request, the handler first authenticates the user and checks their permission through the \`getUserPermissions\` method. It then calls the \`getAssignables\` method to retrieve a filtered list of assignables based on the user's roles and permissions. The underlying logic of the \`getAssignables\` method involves querying the database for all relevant items, applying any necessary filters or joins to include only what the user is permitted to see. The final output is a comprehensive list of assignables encoded in JSON format, which is then returned in the response payload.`,
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
