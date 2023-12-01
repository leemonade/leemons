const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove a specified task',
  description: `This endpoint allows for the deletion of a specific task. The task to be deleted is identified by a unique identifier provided in the request.

**Authentication:** Users need to be authenticated in order to delete tasks. A valid session or authorization mechanism is required to authenticate the user before proceeding with the task deletion.

**Permissions:** Users must have the necessary permissions to delete a task. This usually means that the user must have ownership of the task or relevant administrative privileges.

Upon receiving a request for task deletion, the \`removeRest\` handler function calls the \`remove\` core method from the file \`/Users/rvillares/Desktop/workdir/leemonade/leemons-saas/leemons/plugins/leemons-plugin-tasks/backend/core/task/remove.js\`. This core method is responsible for carrying out the process of removing the task from the system. It involves checking for user authentication, validating the user's permissions, and then performing the necessary database operations to delete the task. If successful, the method returns a confirmation of the task's deletion, otherwise, it throws an error with appropriate details which is then communicated back to the client.`,
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
