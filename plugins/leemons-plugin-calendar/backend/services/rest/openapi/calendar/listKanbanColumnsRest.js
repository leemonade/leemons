const { schema } = require('./schemas/response/listKanbanColumnsRest');
const { schema: xRequest } = require('./schemas/request/listKanbanColumnsRest');

const openapi = {
  summary: 'List all Kanban columns',
  description: `This endpoint lists all the Kanban columns that are available within a specific board in the calendar system. It retrieves an organized collection of columns representing different stages or categories of tasks or events.

**Authentication:** Users must be authenticated to request the list of Kanban columns. Unauthenticated requests will be rejected.

**Permissions:** Users need to have the 'view_kanban_columns' permission to access this endpoint. The permission checks are crucial to ensure that only authorized users can view the Kanban column data.

Upon receiving the request, the \`listKanbanColumnsRest\` handler initiates the process by validating the incoming request data against predefined schemas using the functions outlined in 'forms.js'. Authentication and permission checks are performed to ensure that the request is made by a logged-in user with the appropriate access rights. The handler then calls the \`list.js\` file under the 'kanban-columns' core directory to execute the database query and retrieve the list of columns. This method sorts and prepares the Kanban columns data to be returned to the user. The full Kanban column information is sent back to the client in a structured JSON response.`,
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
