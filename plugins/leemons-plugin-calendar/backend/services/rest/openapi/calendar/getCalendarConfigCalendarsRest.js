const { schema } = require('./schemas/response/getCalendarConfigCalendarsRest');
const {
  schema: xRequest,
} = require('./schemas/request/getCalendarConfigCalendarsRest');

const openapi = {
  summary: 'Fetches calendar configurations associated with a specific center',
  description: `This endpoint retrieves all configurations of the calendar associated with a given center ID, primarily focusing on organizing and managing calendar events relevant to the specific center.

**Authentication:** User authentication is required to ensure secure access to calendar configurations. Users must provide valid credentials to interact with this endpoint.

**Permissions:** The user needs to have 'view_calendar_configurations' permission to fetch calendar settings. This ensures that only authorized personnel can access sensitive calendar data.

The process flow begins with the \`getCalendars\` method in the \`calendar-configs\` core. This method takes the center ID from the request parameter and accesses the database to retrieve all calendar configurations related to that center. The method handles data querying and ensures that only appropriate data is fetched based on the provided center ID. The response returns a detailed list of calendar configurations, including types of events, scheduling details, and customization options, formatted as a JSON object.`,
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
