const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List all permissions available in the system',
  description: `This endpoint provides a comprehensive listing of all permissions that a user or system can be granted within the platform. It is primarily used to fetch a structured list of permissions, which helps in managing and assigning user roles and rights effectively.

**Authentication:** User must be logged into the system to access this endpoint. Unauthorized access attempts will be rejected, ensuring that only authenticated users can retrieve permission information.

**Permissions:** The user must have administrative rights or an equivalent level of permissions specifically allowing them to view all permissions. This is critical to ensure that only authorized personnel manage and view sensitive permission data.

From the outset, the \`listRest\` handler function activates the core method from the \`permissions\` module, particularly targeting the \`list.js\` file. This method systematically gathers all permissions defined across the platform. It encapsulates both default and dynamically added permissions into a structured response. Each permission is associated with its respective module, allowing for easy identification and management. The endpoint processes this data, and the result is returned as a JSON object listing all permissions, which can then be utilized for further administrative tasks or audits.`,
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
