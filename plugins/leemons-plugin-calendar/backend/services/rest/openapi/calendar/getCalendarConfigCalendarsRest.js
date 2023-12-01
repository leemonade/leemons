const { schema } = require('./schemas/response/getCalendarConfigCalendarsRest');
const {
  schema: xRequest,
} = require('./schemas/request/getCalendarConfigCalendarsRest');

const openapi = {
  summary: 'List calendar configurations associated with a center',
  description: `This endpoint provides a list of calendar configurations that are associated with a specific educational center. It aims to offer a centralized view of all the calendar-related settings that apply to a particular center within the educational software platform.

**Authentication:** To access this endpoint, users need to be authenticated. Only authorized sessions with valid credentials will be allowed to retrieve calendar configuration data.

**Permissions:** Users require specific permissions related to calendar configuration management. The exact permission checks are performed to ensure the user has the rights to access educational center-specific calendar configurations.

Upon receiving a request, the handler starts by verifying the authentication and permission status of the user. It then invokes the \`getCalendars\` method from the \`calendar-configs\` core service with the appropriate center identification parameters. This method is responsible for fetching all calendar configurations linked to the given center from the database. The fetched configurations are processed and returned to the client as an array of calendar configuration objects, encapsulated in a JSON format within the HTTP response body.`,
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
