const { schema } = require('./schemas/response/duplicateRest');
const { schema: xRequest } = require('./schemas/request/duplicateRest');

const openapi = {
  summary: 'Duplicates a specific task',
  description: `This endpoint is responsible for duplicating an existing task identified by its unique ID. It copies the task details and creates a new task with the same attributes but a new identifier.

**Authentication:** Users must be logged in to duplicate a task. Requests without valid authentication will be rejected.

**Permissions:** A user needs to have edit or create permissions on tasks to perform duplication. Without the necessary permissions, the endpoint will deny access to the task duplication functionality.

The controller initiates the duplication process by calling the \`duplicate\` function from the \`task\` core module. It receives the task ID to be duplicated from the request parameters. The \`duplicate\` function internally handles the task of fetching the existing task data, cloning its details while generating a new task ID, and saving the new task entry in the database. It ensures that all linked items, such as subtasks and attachments, are also duplicated appropriately. Once the duplication is complete, the new task details are returned in the response, signalling successful operation.`,
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
