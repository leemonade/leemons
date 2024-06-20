const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update a specific task',
  description: `This endpoint updates the details of an existing task based on the provided task ID and updates sent in the request body. Only fields specified in the request will be updated, ensuring minimal data manipulation and maintaining data integrity.

**Authentication:** Users must be authenticated to modify task details. An invalid or missing authentication token will prevent access to this endpoint.

**Permissions:** Users need to have 'edit_task' permissions to update a task. Without appropriate permissions, the request will be rejected, ensuring strict compliance with user roles and privileges.

The endpoint begins by invoking the 'updateTask' method from the 'task' core module. This method takes 'ctx' (context) parameter, which includes user authentication information, and 'data' parameter containing fields to be updated. The method checks for user permissions and validates the fields against pre-set criteria to avoid undesirable data updates. Upon successful validation, it interacts with the database to update the specific fields of the task in question. The completion of the action sends a response back with the updated task details, indicating a successful operation or returning an error message in case of failure.`,
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
