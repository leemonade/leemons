const { schema } = require('./schemas/response/removeEventRest');
const { schema: xRequest } = require('./schemas/request/removeEventRest');

const openapi = {
  summary: 'Removes a specific event from the calendar',
  description: `This endpoint removes an existing event based on the provided event ID. The operation checks if the event exists and if the user has appropriate permissions to delete the event. The deletion is either a soft delete or a hard delete based on certain conditions like event recurrence or links.

**Authentication:** Users need to be authenticated to perform deletion of an event. An invalid or missing authentication token will result in endpoint access denial.

**Permissions:** The user requires specific permissions to delete events. Typically, this includes permissions like 'event.delete' or 'admin' rights on the calendar where the event is scheduled.

The process begins with the \`removeOrCancel\` function, which first verifies if the user has the required permissions to delete the event. It then checks if the event needs a soft delete (just marking the event as deleted) or a hard delete (completely removing all traces of the event from the database). This decision is based on factors such as whether the event is recurring or has dependencies, such as linked events or notifications. After the appropriate deletion operation, a confirmation is sent back to the user indicating the success of the deletion, or an error message is returned in case of failure.`,
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
