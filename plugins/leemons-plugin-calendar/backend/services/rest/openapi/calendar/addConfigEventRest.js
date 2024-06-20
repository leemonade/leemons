const { schema } = require('./schemas/response/addConfigEventRest');
const { schema: xRequest } = require('./schemas/request/addConfigEventRest');

const openapi = {
  summary: 'Adds a new configuration event to a calendar',
  description: `This endpoint allows the creation of a new event within a specific calendar configuration. The event details such as title, time, and description are sent to the server, and a new event entry is created in the database associated with the indicated calendar.

**Authentication:** Users need to be authenticated to add events. Any attempt to access this endpoint without a valid authentication token will result in denial of access.

**Permissions:** Users must have the 'calendar.manage' permission to add new events to a calendar. Without this permission, the server will reject the request.

Upon receiving a request, the \`addConfigEventRest\` handler in the \`calendar.rest.js\` file triggers the \`addEvent\` method in the \`CalendarConfigs\` core service. This method processes the input data, checking for validity and completeness, then interacts with the database to insert the new event record. Once the addition is successful, a response indicating the successful creation of the event is sent back to the client. Error handling is incorporated to manage and respond to any issues that occur during the event creation process.`,
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
