const { schema } = require('./schemas/response/updateEventRest');
const { schema: xRequest } = require('./schemas/request/updateEventRest');

const openapi = {
  summary: "Update an existing event's details",
  description: `This endpoint allows for the modification of an existing event's details based on the provided event identifier. It adjusts the properties like the event's name, duration, and any associated metadata. The update process ensures that only valid and permitted changes are applied to the event.

**Authentication:** Users are required to be authenticated in order to perform an update operation on an event. Unauthenticated requests will be rejected.

**Permissions:** The user must have edit permissions for the particular event they attempt to update. If the user lacks the necessary permissions, the request will be denied and an error message returned.

The endpoint begins by validating the user's authentication status and permissions for the event specified in the request. Upon successful authentication and authorization, it calls the \`update\` method located in the \`Events\` core module, passing necessary parameters like the event ID and the new data to be updated. This method handles the logic of verifying which pieces of event information can be updated, ensuring data integrity and adherence to any constraints set within the application's business rules. Once updates are applied, it saves the changes to the database and returns an acknowledgment response to the client that the event was successfully updated.`,
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
