const { schema } = require('./schemas/response/listKanbanEventOrdersRest');
const {
  schema: xRequest,
} = require('./schemas/request/listKanbanEventOrdersRest');

const openapi = {
  summary: 'List kanban event orders',
  description: `This endpoint lists all kanban event orders associated with a specific calendar. It provides an organized view of events, allowing the user to see the sequence and hierarchy of kanban events within the calendar.

**Authentication:** Users need to be authenticated to access the kanban event orders. Without proper authentication, the endpoint will reject the request.

**Permissions:** Specific permissions are required to view kanban event orders. The user must have the appropriate rights to access calendar details and its associated kanban events.

Upon receiving a request, the \`listKanbanEventOrdersRest\` handler initiates a process to gather all relevant kanban event order data. It calls the \`list\` method from the \`kanban-event-orders\` core module. This method interacts with the underlying database to retrieve an ordered list of kanban events tied to the requested calendar id. The retrieved data is then formatted according to the kanban structure, ensuring that the hierarchical order of events is preserved. The final response to the client is a well-structured JSON object representing the kanban event orders, making it easy for the frontend interface to display this information effectively to the user.`,
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
