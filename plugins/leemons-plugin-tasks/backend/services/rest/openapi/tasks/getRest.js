const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Retrieve task details by ID',
  description: `This endpoint retrieves the full details of a specific task based on its unique identifier. The task details include all associated information required to understand the task context and its current status in the system.

**Authentication:** Users must be authenticated to request task details. Unauthenticated requests will be rejected, ensuring that only rightful users can access sensitive task data.

**Permissions:** Appropriate access rights are necessary to fetch task details. Users without the correct permission set will receive an authorization error, maintaining the integrity of task data security.

Upon receiving a request, the \`getRest\` handler calls the \`get.js\` method within the task's core logic. The method expects a task ID as an input parameter, which it then utilizes to query the database for the corresponding task data. The process involves several checks: ensuring the task exists, verifying the user's access rights, and potentially more based on the task's visibility rules and ownership. Once these validations pass, the method retrieves the task details, which are then formatted and returned as a JSON object in the HTTP response. If any step fails, such as the task not existing or the user lacking permissions, the appropriate error message is sent back.`,
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
