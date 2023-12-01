const { schema } = require('./schemas/response/removeEventRest');
const { schema: xRequest } = require('./schemas/request/removeEventRest');

const openapi = {
  summary: 'Remove a specific event for the user',
  description: `This endpoint allows for the removal of a specific event from the user's calendar. It handles the deletion or cancellation of the event according to specific rules, such as user permissions, event type, and ownership status.

**Authentication:** User authentication is required to ensure that the request is made by a valid and logged-in user. Unauthenticated requests will be denied, and the user will not be able to perform any operations on events.

**Permissions:** The user must have appropriate permissions to delete the event. Depending on the event's share settings and the user's role, the permissions to remove or cancel the event vary. If the user lacks adequate permissions, the endpoint will reject the request.

Upon receiving the request, the \`removeEventRest\` handler first checks the user's authentication status and permissions for the event in question. It then calls the \`removeOrCancel\` function from the \`events\` core module, which determines whether the event should be completely removed or simply marked as cancelled. The decision is based on factors like the event's recurrence, participants, and creator. If removal is possible, the \`remove\` function is called, which executes the necessary database operations to delete the event. On the other hand, if only cancellation is allowed, the event's status is updated accordingly without actual deletion. The response to the client includes confirmation of the action taken or an error message in case of failure.`,
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
