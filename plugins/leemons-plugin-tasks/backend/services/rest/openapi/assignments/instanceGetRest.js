const { schema } = require('./schemas/response/instanceGetRest');
const { schema: xRequest } = require('./schemas/request/instanceGetRest');

const openapi = {
  summary: 'Fetch a list of tasks assigned to the user',
  description: `This endpoint retrieves all tasks assigned to the currently authenticated user. It is designed to obtain a structured list that aggregates tasks from various assignments, projects, or courses that the user is involved in.

**Authentication:** Users must be authenticated to request their assigned tasks. Non-authenticated requests are rejected, ensuring that only properly authenticated user requests are served.

**Permissions:** Users need the appropriate permission level to access their assigned tasks. Without the required permissions, the endpoint will deny the request, adhering to the application's security protocol on task visibility and user roles.

The controller flow begins with verifying the user's authentication status and permission scope. Once authenticated and authorized, the \`getTasksForUser\` method is invoked to gather all tasks tied to the user's account. This involves querying the internal task management system, filtering the tasks by the user's identity, and organizational roles. The resulting tasks are then sent back to the user in a structured JSON response, which details all the assignments relevant to the user, including metadata for each task.`,
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
