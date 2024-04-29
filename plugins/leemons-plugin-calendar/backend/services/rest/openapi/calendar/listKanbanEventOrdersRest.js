const { schema } = require('./schemas/response/listKanbanEventOrdersRest');
const {
  schema: xRequest,
} = require('./schemas/request/listKanbanEventOrdersRest');

const openapi = {
  summary: 'Lists all Kanban event orders associated with a user',
  description: `This endpoint provides a list of all Kanban event orders that are associated with the authenticated user's calendar. Events are sorted according to their order in the Kanban board, which represents their priority or sequence in the user's workflow.

**Authentication:** Users must be logged in to access their Kanban event orders. The endpoint checks for a valid session or token before proceeding with the request.

**Permissions:** This endpoint requires the 'view_kanban_events' permission, indicating that the user has the right to view Kanban events within their scope of accessibility.

Upon receiving a GET request, \`listKanbanEventOrdersRest\` initially verifies the user's authentication status and permissions. If the checks are valid, it then calls the \`list\` function from 'kanban-event-orders' directory, which queries the database for all Kanban events linked to the user. This data retrieval involves sorting mechanisms based on pre-defined criteria such as event priority or scheduled dates. After successful retrieval, the Kanban event data is formatted and returned as a JSON response to the client.`,
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
