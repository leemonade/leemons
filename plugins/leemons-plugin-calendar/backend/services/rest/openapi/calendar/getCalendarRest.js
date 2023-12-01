const { schema } = require('./schemas/response/getCalendarRest');
const { schema: xRequest } = require('./schemas/request/getCalendarRest');

const openapi = {
  summary: 'Fetch calendars associated with a center',
  description: `This endpoint fetches a list of calendar configurations associated with a specific educational center. It provides the necessary information to render calendars and their events within the SaaS platform interface.

**Authentication:** Users need to be authenticated to fetch calendar information. Non-authenticated requests will not be processed and will result in an access error.

**Permissions:** Users must have the 'view_calendar' permission granted to retrieve the calendar data. Without the required permissions, the request will result in an authorization error.

Upon receiving a request, the handler calls the \`getCalendarsToFrontend\` method, which takes as input the center ID provided by the user context. The \`getCalendarsToFrontend\` function performs the task of aggregating calendar configurations and event data relevant to the provided center ID. It communicates with the underlying Calendar and Calendar Configs services to collect the necessary data, such as availability, event types, and configuration settings. Finally, it compiles the data into a coherent structure and sends it back as the response payload, formatted as a JSON object containing an array of calendars with their respective configurations and events.`,
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
