const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update user roles',
  description: `This endpoint updates the roles assigned to a user based on input specifications. It typically involves modifying specific role attributes or replacing an existing role with a new set in the system database.

**Authentication:** Users must be authenticated to modify roles. Lack of proper authentication will prohibit access to this endpoint.

**Permissions:** The user requires administrator level permissions to update roles, ensuring that only authorized personnel can make changes to role configurations.

Upon receiving a request, the endpoint initially validates the user's authentication and authorization levels. It then employs a series of method calls beginning with \`validateRoleUpdateParams\`, which ensures the request parameters meet the necessary criteria for a valid role update. After validation, the \`updateRole\` function from the roles service is invoked, where the actual updates to the role records are performed based on the provided parameters. This may include changing the role name, description, or associated permissions. The response back to the client confirms the successful update of the roles, supplemented by any relevant data changes made during the process.`,
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
