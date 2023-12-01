const { schema } = require('./schemas/response/duplicateRest');
const { schema: xRequest } = require('./schemas/request/duplicateRest');

const openapi = {
  summary: 'Duplicate a specified task for reusability',
  description: `This endpoint is responsible for creating a duplicate copy of an existing task. The duplication process includes cloning the task's metadata, configurations, and associated data to generate a new, identical task entry within the system.

**Authentication:** Users must be logged in to duplicate tasks. Unauthorized attempts to access the endpoint will be rejected.

**Permissions:** Users need to have 'task-duplicate' permission to create a duplicate of a task. Without this permission, the action will not be authorized.

Upon receiving a request to duplicate a task, the 'duplicateRest' handler invokes the \`duplicate\` function found in the \`task/duplicate.js\` module. This function is responsible for copying the task data, ensuring that all references, details, and configurations are properly replicated to the new task. Once the duplication is completed successfully, the newly created task's details are returned in the response. The response includes the identifier of the new task along with other relevant metadata, allowing the client to immediately interact with the duplicate task.`,
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
