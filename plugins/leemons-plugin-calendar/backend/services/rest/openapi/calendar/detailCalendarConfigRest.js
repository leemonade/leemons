const { schema } = require('./schemas/response/detailCalendarConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/detailCalendarConfigRest');

const openapi = {
  summary: 'Get detailed configuration of a specific calendar',
  description: `This endpoint retrieves the detailed configuration for a specific calendar based on the provided unique identifier. The detailed configuration includes settings such as calendar name, type, associated events, and other metadata that defines how the calendar operates within the Leemons SaaS platform.

**Authentication:** Users must be authenticated to access calendar configurations. The request will be rejected if it lacks a valid authentication token or if the session is not active.

**Permissions:** Users need to have specific permissions to view calendar configurations. The required permission checks are based on user roles and the relationship between the user and the calendar, ensuring that only authorized personnel can access the configuration details.

Upon receiving the request, the handler first verifies the user's authentication status and permissions. If these checks pass, it then calls the \`detail\` method from the \`calendar-configs\` core module. This method is responsible for fetching the calendar configuration from the database using the provided identifier. The database query filters ensure that only the requested calendar's configuration is retrieved. Once the data is fetched, it is formatted appropriately and returned to the client in JSON format. During this process, the handler also handles possible exceptions, such as calendar not found or database errors, returning the corresponding error messages to the client.`,
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
