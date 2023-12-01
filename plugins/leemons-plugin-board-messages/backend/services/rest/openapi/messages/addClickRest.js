const { schema } = require('./schemas/response/addClickRest');
const { schema: xRequest } = require('./schemas/request/addClickRest');

const openapi = {
  summary: 'Record a click event on a message',
  description: `This endpoint is responsible for tracking and recording click events on a specific message within the message board interface. When a message is clicked, this handler captures the event and logs the click to monitor user interaction with message content.

**Authentication:** Users need to be authenticated to record a click event. Unauthorized access will be blocked, ensuring that only valid, logged-in users can trigger a click logging action.

**Permissions:** Users must have the necessary permissions to interact with the message that they are attempting to log a click for. This ensures that only users with appropriate access can contribute to the click metrics of a message.

Upon receiving a click event, the \`addClickRest\` handler validates the user’s authentication and permission to interact with the message. It then calls the \`addClick\` method from the \`messages\` core, which further processes the request. The \`addClick\` method is responsible for updating the relevant message’s click count in the system’s database. This action is accomplished by a series of operations that verify the message’s existence, increment its click count, and save the updated information back to the database. When the operation is successful, the method returns a confirmation response indicating that the click has been recorded. In the case of an error or an invalid request, an appropriate error message is returned to the client.`,
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
