const { schema } = require('./schemas/response/addViewRest');
const { schema: xRequest } = require('./schemas/request/addViewRest');

const openapi = {
  summary: 'Add a view to a specific message',
  description: `This endpoint is responsible for recording a new view of a message on the board. When a user views a message, this endpoint updates the message's view count accordingly.

**Authentication:** Users need to be authenticated in order to record a view on a message. If authentication is not provided or is invalid, the view will not be recorded.

**Permissions:** The user must have the 'view-messages' permission to record a view. If they do not have this permission, their view attempt will be rejected.

Once the 'addView' operation is triggered, the handler begins by validating the user's authentication and permissions. If the user is authenticated and authorized, the handler calls the \`addView\` method from the \`messages\` core. This method is tasked with incrementing the view counter for the specified message in the database. It takes the message ID from the request parameters and utilizes this to locate the message entity to update. The internal method ensures atomic updates to prevent any data inconsistency during concurrent view submissions. Once the update is complete, the method returns an acknowledgment that the view has been added, which is then relayed back to the user as the response.`,
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
