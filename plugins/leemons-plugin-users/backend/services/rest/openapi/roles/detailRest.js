const { schema } = require('./schemas/response/detailRest');
const { schema: xRequest } = require('./schemas/request/detailRest');

const openapi = {
  summary: 'Provides detailed information about a specific role',
  description: `This endpoint retrieves detailed information about a specified role within the system, including all related permissions, users associated with the role, and system-wide implications of the role.

**Authentication:** This endpoint requires that the user must be logged in to access this information. Unauthenticated attempts to access this endpoint will be rejected.

**Permissions:** The user needs to have 'admin' level permissions to view detailed role information. Attempting to access without sufficient permissions will result in access denial.

The process initiated by this endpoint involves fetching role details primarily from the \`getRoleDetails\` function within the \`roles\` service. The function queries the database to gather comprehensive details about the role, including linked permissions and users. Subsequently, the method may involve additional validation checks to ensure that the user requesting the information has the necessary permissions to view these details. The final response to the request will provide a complete set of information about the role structured in a JSON format.`,
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
