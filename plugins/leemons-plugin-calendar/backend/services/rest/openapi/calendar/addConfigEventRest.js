const { schema } = require('./schemas/response/addConfigEventRest');
const { schema: xRequest } = require('./schemas/request/addConfigEventRest');

const openapi = {
  summary: 'Adds a calendar configuration event',
  description: `This endpoint is responsible for adding a new event to a calendar configuration. It expects the provision of necessary event details which include, but are not limited to, title, start and end dates, and any relevant metadata associated with the event to be created.

**Authentication:** This action requires the user to be authenticated. Unauthenticated requests will be rejected, and the user will not be able to add events to the calendar configuration.

**Permissions:** Users need to have the appropriate permissions to add events to the specified calendar configuration. Without the correct permissions, the request to add an event will be denied.

Upon receiving a request, the \`addConfigEventRest\` handler internally calls the \`addEvent\` method from the \`calendar-configs\` core. This method is tasked with validating the provided event details, ensuring no conflicts with existing events, and persisting the new event to the system's database. If the operation is successful, the created event's data is returned to the client. Otherwise, the system provides an informative error message detailing why the event could not be added.`,
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
