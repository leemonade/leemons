const { schema } = require('./schemas/response/updateConfigEventRest');
const { schema: xRequest } = require('./schemas/request/updateConfigEventRest');

const openapi = {
  summary: 'Updates a calendar event configuration',
  description: `This endpoint updates specific details of an existing calendar event configuration. Events can include various parameters like time, description, participants, and other metadata which can be modified through this endpoint.

**Authentication:** Users must be authenticated to request updates to a calendar event configuration. This ensures that only valid and authenticated users can make changes to event details.

**Permissions:** Users need to have edit permissions for the specific calendar event. The required permission might be something like 'calendar_event_edit', which ensures that only users with the necessary rights can make updates to the events.

Upon receiving the request at the 'updateConfigEventRest' handler, the method first verifies user authentication and checks if the user holds the required permissions to edit the event. After validation, it calls the \`updateEvent\` method in the calendar configuration service. This method handles the logic for updating the event details in the database, ensuring that all provided changes comply with business rules and data integrity. The response to the client indicates whether the update was successful or if any errors occurred during the process.`,
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
