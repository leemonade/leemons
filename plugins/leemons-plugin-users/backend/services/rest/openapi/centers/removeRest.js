const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Removes a center from the system',
  description: `This endpoint handles the deletion of a center within the system. It allows for the removal of specified center data if the prerequisites are met, ensuring data integrity and compliance with system rules.

**Authentication:** User must be authenticated to access this endpoint. Without a valid session or authentication credentials, the request will be rejected.

**Permissions:** The user must have admin-level permissions to remove a center. Specific rights to modify or delete center information are required to execute this operation.

Upon receiving a request, this handler calls the \`remove\` method in the \`/Users/usuario/Sites/leemonade/leemons/plugins/leemons-plugin-users/backend/core/centers/remove.js\` core file. This method checks if the center exists and verifies the user has the necessary permissions. If all conditions are met, the center is removed from the database. The process involves several checks to ensure the integrity of the operation, handling errors gracefully and reverting changes if necessary to maintain system consistency. Finally, a success response is returned, indicating that the center has been successfully removed.`,
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
