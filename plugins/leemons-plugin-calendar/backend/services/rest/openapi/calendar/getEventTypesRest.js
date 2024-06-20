const { schema } = require('./schemas/response/getEventTypesRest');
const { schema: xRequest } = require('./schemas/request/getEventTypesRest');

const openapi = {
  summary: 'List all event types available in the calendar',
  description: `This endpoint lists all event types that are available within the calendar system. It is responsible for retrieving a structured list of event types, which may include their unique identifiers, descriptions, and other relevant metadata.

**Authentication:** Access to this endpoint requires the user to be authenticated. An authentication check is performed to ensure only authenticated users can retrieve the list of event types.

**Permissions:** Users need to have the appropriate permissions to view event types. This typically involves permissions related to accessing or managing calendar events within the system.

Upon receiving a request, the handler invokes the \`listEventTypes\` function from the calendar's event-types core module. This function queries the database for all existing event types and compiles them into a list. Each event type in the list includes details such as the name, description, and any relevant configuration settings. After retrieval, the data is formatted and sent back to the client as a JSON response, providing a comprehensive overview of available event types in the calendar.`,
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
