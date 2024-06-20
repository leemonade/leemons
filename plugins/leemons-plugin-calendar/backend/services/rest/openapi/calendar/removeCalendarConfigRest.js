const { schema } = require('./schemas/response/removeCalendarConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/removeCalendarConfigRest');

const openapi = {
  summary: 'Remove a specific calendar configuration',
  description: `This endpoint is responsible for deleting a calendar configuration identified by its unique ID. The operation removes the specified configuration from the system, which includes all associated scheduling and metadata, effectively rendering the calendar unusable for future activities.

**Authentication:** Users need to be authenticated to perform this operation. A valid session or authentication token must be provided to authorize the request.

**Permissions:** Users require specific permissions related to calendar management. Typically, this includes permissions like 'calendar.delete' or 'admin.calendar' to ensure that only authorized personnel can remove calendar configurations.

Upon receiving the request, the \`removeCalendarConfigRest\` action first verifies user's authentication and permissions. It then proceeds to invoke the \`remove\` method from the \`CalendarConfigs\` core. This method is tasked with executing the deletion of the calendar configuration from the database. If the deletion is successful, the endpoint returns a confirmation message. If the specified configuration does not exist or the user lacks adequate permissions, it responds with an appropriate error message.`,
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
