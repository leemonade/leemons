const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List roles available in the system',
  description: `This endpoint lists all the roles available within the system, providing a comprehensive overview of what types of roles users can be assigned to. It is particularly useful for system administrators or software managing user permissions and role-based access controls within the application.

**Authentication:** Users need to be authenticated to access this list. Access will be denied if the authentication credentials are not provided or are invalid.

**Permissions:** This endpoint requires administrative rights. A user must have the proper administrative role or permission set to access the roles list, ensuring that only authorized personnel can view sensitive role information.

Upon receiving a request, this endpoint initiates by invoking the \`listRoles\` method within the roles management service. This method interacts with the database to retrieve all records from the roles collection. The resulting data includes detailed role identifiers, names, and any associated permissions or constraints each role bears. The response from the service is structured and returned to the requester in JSON format, outlining all roles with their respective details.`,
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
