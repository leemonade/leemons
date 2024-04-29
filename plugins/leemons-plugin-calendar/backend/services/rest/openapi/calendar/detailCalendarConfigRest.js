const { schema } = require('./schemas/response/detailCalendarConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/detailCalendarConfigRest');

const openapi = {
  summary: 'Displays detailed configuration of a specific calendar',
  description: `This endpoint retrieves detailed configuration data for a specific calendar based on the provided calendar ID. The endpoint aims to provide essential configuration details that might include settings like visibility, editing permissions, event rules, and other relevant attributes that define the behavior of the calendar.

**Authentication:** Users need to be authenticated to request calendar configuration details. Attempting to access this endpoint without a valid authentication token will result in a denial of service.

**Permissions:** The user must have the 'view_calendar_details' permission. Without this permission, the endpoint will restrict access, ensuring that only authorized users can view detailed calendar configurations.

Upon receiving a request, the endpoint first verifies user authentication and checks if the user has the required permissions to view calendar details. If these checks are passed, the service calls the \`detail\` method in the 'calendar-configs' core with the identifier of the calendar to pull detailed information. This method interacts with the database to fetch comprehensive data about the calendar's configuration. The response is then formatted into a structured JSON object containing all relevant calendar configurations, which is sent back to the client.`,
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
