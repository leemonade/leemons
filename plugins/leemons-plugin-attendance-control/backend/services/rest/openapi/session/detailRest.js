const { schema } = require('./schemas/response/detailRest');
const { schema: xRequest } = require('./schemas/request/detailRest');

const openapi = {
  summary: 'Session attendance details for selected IDs',
  description: `This endpoint retrieves the attendance details associated with specific session IDs provided in the request. It is designed to provide a summary of attendance data for sessions, including participants and their attendance status.

**Authentication:** Users need to be authenticated to request attendance details. Authentication ensures that only authorized individuals can access the attendance information.

**Permissions:** Users must have the 'view-attendance' permission to access this endpoint. Without this permission, the user's request will be rejected, and the endpoint will return an authorization error.

Upon receiving a request, the endpoint calls the \`byIds\` method found in the \`session\` core module. This method expects a list of session IDs as its argument, which it uses to query the database for relevant attendance records. The database operation fetches the attendance information for the provided session IDs, which includes participant details and attendance statuses. Once retrieved, the endpoint formats this data into a structured response, returning the attendance details for each session ID to the authorized user in a JSON format.`,
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
