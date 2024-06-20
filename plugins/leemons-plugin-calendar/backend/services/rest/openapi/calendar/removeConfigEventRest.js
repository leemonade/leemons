const { schema } = require('./schemas/response/removeConfigEventRest');
const { schema: xRequest } = require('./schemas/request/removeConfigEventRest');

const openapi = {
  summary: 'Remove a specific calendar configuration event',
  description: `This endpoint handles the deletion of a specific event from a calendar configuration. The event to be deleted is identified by its unique event ID, which must be provided as part of the request. The operation ensures that the specified event is properly removed from the system's calendar configuration, maintaining the integrity of the remaining calendar events.

**Authentication:** Users must be authenticated and possess a valid session token to access this endpoint. Unauthorized access attempts will be logged and denied.

**Permissions:** The user needs to have administrative rights or specific permissions on the calendar module to perform event deletions. Lack of appropriate permissions will result in an access denial response.

Upon receiving the request, the server invokes the \`removeEvent\` method from the \`CalendarConfigs\` core. This method takes the event ID from the request parameters and performs a query to locate the event within the database. If the event is found, it proceeds with the deletion process, which involves removing the event record and ensuring that any references to this event in other parts of the application are also updated or removed as necessary. The method concludes by returning a success message if the deletion is successful, or an error message detailing why the deletion could not be completed.`,
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
