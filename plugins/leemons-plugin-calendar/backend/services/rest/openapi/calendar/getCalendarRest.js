const { schema } = require('./schemas/response/getCalendarRest');
const { schema: xRequest } = require('./schemas/request/getCalendarRest');

const openapi = {
  summary: 'Manage calendar configurations by center',
  description: `This endpoint is responsible for handling calendar configurations associated with a specific center. It allows operations such as retrieving, updating, and deleting calendar configurations based on the provided center ID.

**Authentication:** Users need to be authenticated to interact with calendar configurations. Failure to provide a valid authentication token will result in denial of access to the endpoint.

**Permissions:** Users must have administrative roles or specific permissions related to calendar management within the center. These permissions check ensures that only authorized personnel can manage or access calendar configurations.

Upon receiving a request, the endpoint first verifies user authentication and permissions. If these checks are successful, the \`getByCenterId\` method from the \`calendar-configs\` core is called, receiving the center ID as its argument. This method queries the database for all calendar configurations linked to the specified center. The process involves database operations to ensure data integrity and privacy. Finally, the response is formulated based on the retrieved data, which includes detailed information about each calendar configuration, and sent back to the client in a structured JSON format.`,
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
