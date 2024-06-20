const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove a specified task',
  description: `This endpoint allows for the deletion of a specific task based on the task ID provided. The purpose is to permanently remove a task record from the system, ensuring that all its associated data is also cleared appropriately from the database.

**Authentication:** Users need to be logged in to perform deletion operations. Authentication is required to ensure that a user can only delete tasks they are authorized to remove.

**Permissions:** This endpoint requires the user to have task deletion permissions. If the user does not have the appropriate permissions, the request will be denied, ensuring system security and data integrity.

Upon receiving a deletion request, the \`removeRest\` handler in the \`tasks.rest.js\` file calls the \`remove\` method from the \`task\` core (\`remove.js\`). The method takes the task ID from the request parameters and proceeds to check if the task exists and if the user has the necessary permissions to delete it. If these conditions are met, the task is removed using a database call that specifically targets this entry. Subsequent related data such as task logs or sub-tasks may also be cleared, depending on the system's configuration and relationships defined within the database. The process culminates in a response that confirms the deletion or provides an error message detailing why the task could not be deleted.`,
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
