const { schema } = require('./schemas/response/updateConfigEventRest');
const { schema: xRequest } = require('./schemas/request/updateConfigEventRest');

const openapi = {
  summary: 'Update an existing calendar event configuration',
  description: `This endpoint updates an existing event within a calendar configuration based on the provided event details. It is used when modifications to an event's information are needed, such as changes to the event title, timing, or associated metadata.

**Authentication:** The endpoint requires the user to be logged in to perform an update operation on a calendar event. Failure to provide valid authentication credentials will prevent access to endpoint functionality.

**Permissions:** Users need to have edit permissions for the calendar they are attempting to update. Without the proper permissions, the update request will be denied.

Upon receiving a request, the \`updateConfigEventRest\` handler initiates a series of actions to process the update. It begins with authorization checks to confirm the user's authentication status and access rights to edit the specific calendar event. Once authorized, it calls the \`updateEvent\` method from the \`calendar-configs\` core module, passing along the modified event data from the request body. This method engages with the relevant data storage systems to apply the requested changes to the existing calendar event. If successful, the endpoint will return a confirmation of the event's update, comprising updated event details. In the case of an error or invalid update parameters, an appropriate error message is returned, detailing the issue encountered.`,
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
