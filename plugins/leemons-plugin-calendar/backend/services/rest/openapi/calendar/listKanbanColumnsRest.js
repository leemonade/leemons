const { schema } = require('./schemas/response/listKanbanColumnsRest');
const { schema: xRequest } = require('./schemas/request/listKanbanColumnsRest');

const openapi = {
  summary: 'List all Kanban columns associated with a specific calendar',
  description: `This endpoint fetches a list of all Kanban columns that are associated with a specific calendar within the leemons plugin calendar system. The endpoint serves as a utility for front-end services to render organized Kanban views based on the user's calendar data.

**Authentication:** Users must be authenticated to request the list of Kanban columns. De-authenticated or improperly authenticated requests will be promptly denied, safeguarding the user-specific data.

**Permissions:** Proper access rights are required to view the Kanban columns. Typically, users need permissions to access the specific calendar or project management features that relate to Kanban management.

The process begins when the \`listKanbanColumnsRest\` action is invoked, pulling the relevant calendar ID from the request parameters. It then calls the \`list\` method from the \`kanban-columns\` core module. This module queries the database for all columns linked to the specified calendar ID, ensuring that the response is tailored to the authenticated user's context and permissions. Each column is then formatted appropriately before being sent back to the client as a JSON array in the HTTP response. This ensures users receive an accurate, up-to-date representation of their calendar's Kanban layout.`,
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
