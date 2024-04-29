const { schema } = require('./schemas/response/saveRest');
const { schema: xRequest } = require('./schemas/request/saveRest');

const openapi = {
  summary: 'Save new or update existing board messages',
  description: `This endpoint handles the creation or updates of board messages within the platform. It provides a mechanism for administrators or authorized users to post messages, which may contain announcements, updates, or prompts to board members.

**Authentication:** Users need to be authenticated to access or use this endpoint for posting messages. An incorrect or missing authentication token will restrict access to this functionality.

**Permissions:** Specific permissions such as 'board-message-create' or 'board-message-edit' are required depending on the action the user intends to perform (creating a new message or updating an existing one).

Upon receiving a request, the endpoint triggers the \`save\` method in the \`messages\` core service, which involves a series of processes such as validating the message data against predefined formats and rules in \`validations/forms.js\`. Once validated, the method determines whether it involves a new message creation or an update to an existing message based on the provided identifiers. For a new message, it adds the message to the database and returns a success status along with the message details. For updates, it checks for existing messages and applies updates accordingly. The response includes the status of the operation and any associated details about the saved message.`,
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
