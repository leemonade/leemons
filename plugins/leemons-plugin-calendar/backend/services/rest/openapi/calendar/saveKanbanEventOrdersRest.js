const { schema } = require('./schemas/response/saveKanbanEventOrdersRest');
const {
  schema: xRequest,
} = require('./schemas/request/saveKanbanEventOrdersRest');

const openapi = {
  summary: 'Save Kanban event order configurations',
  description: `This endpoint is designed to save changes to the order of kanban events as defined by the user in a calendar application. The updated order reflects how events are displayed or prioritized in the user's kanban view.

**Authentication:** Users need to be authenticated to modify the order of kanban events. Access to this functionality is restricted based on user authentication status.

**Permissions:** This endpoint requires the user to have the 'edit_kanban_order' permission. Without this, the user's request to reorder kanban events will be denied.

Upon receiving a request, the \`saveKanbanEventOrdersRest\` method in the \`calendar.rest.js\` controller validates the user's authentication and permissions. If validation succeeds, it then calls the \`save\` method from the \`kanban-event-orders\` core module. This method processes the input, which typically includes an array of event IDs and the desired order. It ensures that the order changes comply with business logic, such as checking for conflicts or invalid data. Once the order is successfully updated in the database, the endpoint sends a response that indicates success to the client, along with possibly returning the updated order of events.`,
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
