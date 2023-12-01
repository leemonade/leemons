const { schema } = require('./schemas/response/updateEventRest');
const { schema: xRequest } = require('./schemas/request/updateEventRest');

const openapi = {
  summary: "Updates a specific event's details",
  description: `This endpoint allows for updating the details of a specific event in the calendar. The updated details can include changes to the event's title, description, time, or any other event-related metadata.

**Authentication:** Users must be authenticated to update an event. A valid session or authentication token is required to perform this action.

**Permissions:** Users need to have ‘edit’ permissions on the event they are attempting to update. If the user lacks the necessary permissions, the update will be rejected, and an error will be returned.

Upon receiving a request, the handler first validates the incoming data against a predefined schema to ensure all required fields are present and correctly formatted. After validation, it calls the \`updateFromUser\` method, supplying the event ID and the updated data. This method handles the business logic for updating the event, which may involve querying the database for the existing event, checking the user's permissions, and applying the changes. If the update is successful, the handler sends a response with the updated event data. In cases where the update cannot be performed (e.g., due to missing permissions or an invalid event ID), the handler responds with an appropriate error message and status code.`,
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
