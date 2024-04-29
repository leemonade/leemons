const { schema } = require('./schemas/response/listCalendarConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/listCalendarConfigRest');

const openapi = {
  summary: 'List all calendar configurations',
  description: `This endpoint lists all calendar configurations available within the system. It retrieves a comprehensive list of calendar setups and their related settings, formatted for easy viewing or further processing by the client application.

**Authentication:** Users need to be authenticated to request the list of calendar configurations. Unauthorized access attempts will be rejected.

**Permissions:** Users require specific permissions to view all calendar configurations. The required permissions depend on the organization's settings and the user's role within the application.

Upon receiving a request, the \`listCalendarConfigRest\` handler first verifies the user's authentication status and permissions. This verification ensures that only authorized users can access the calendar configuration data. If authentication and permission checks are passed, the handler then calls the \`list\` method from the \`CalendarConfigs\` core service. This method gathers all available calendar configurations from the database and formats them into a structured list. The response to the client contains this list in a JSON format, making it suitable for further usage in various application scenarios.`,
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
