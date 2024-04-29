const { schema } = require('./schemas/response/addClickRest');
const { schema: xRequest } = require('./schemas/request/addClickRest');

const openapi = {
  summary: 'Logs a new view or interaction with a specific message',
  description: `This endpoint tracks user interactions with a message by logging each click or view event. It is designed to help in analyzing how messages are interacted with by users, allowing for improved message engagement and content refinements over time.

**Authentication:** Users need to be logged in to log interactions with messages. This ensures that each interaction can be attributed to a specific user, enhancing the accuracy of the interaction data.

**Permissions:** Users must have 'view' permissions on the board where the message is posted to interact with messages. If a user does not possess the required permissions, their interaction will not be logged, and they will receive an unauthorized access error.

Upon receiving a request, the 'addClickRest' handler invokes the \`addClick\` method from the \`messages\` core module. This method takes parameters identifying the message and the user who interacted with it. It records each interaction as a click or view event in the database, tagging it with the user's ID and timestamp. The process ensures that all interactions are accurately logged and available for reporting and analytics. The response from this method confirms the successful logging of the interaction, returning a success status to the user.`,
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
