const { schema } = require('./schemas/response/saveRest');
const { schema: xRequest } = require('./schemas/request/saveRest');

const openapi = {
  summary: 'Save attendance session data',
  description: `This endpoint handles the saving of attendance session information submitted by users. It manages the creation or updating of attendance records based on the provided session data.

**Authentication:** Users need to be authenticated to submit attendance data. Unauthorized attempts will be rejected.

**Permissions:** Appropriate permissions are required for a user to save attendance session data. Without necessary permissions, the user's request will be denied.

Upon receiving a save request, the \`saveRest\` handler validates the incoming data using \`forms.js\` for proper structure and content. It then calls the \`save\` method from the \`session\` core module located in \`session/index.js\` and \`session/save.js\`. The \`save\` method takes care of persisting the session data to the database, either by creating a new attendance record or updating an existing one, depending on whether the session already exists. After successful saving of the data, the handler returns a confirmation response to the user indicating the operation's outcome.`,
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
