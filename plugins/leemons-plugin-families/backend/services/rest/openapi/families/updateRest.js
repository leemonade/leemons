const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update family details',
  description: `This endpoint updates the details of an existing family record in the system. It allows for modifications to family data such as names, contact information, and any other family-specific details that are stored within the platform.

**Authentication:** Users must be authenticated to update family details. Updates will be rejected if the authentication token provided is invalid or missing.

**Permissions:** Users need to have the appropriate permissions to update family details. Without the correct permissions, the system will deny access to this endpoint.

Upon receiving the request, the handler starts by verifying the user's authentication state and permission rights to update family details through methods like \`canUpdateFamily\`. If the checks are affirmative, the \`update.js\` method from the families' core is invoked, which processes the provided data and updates the family's record in the database. This process may involve additional methods such as \`setDatasetValues\` or \`recalculeNumberOfMembers\` to ensure all related data reflects the updated family information. If the update is successful, the endpoint sends a confirmation response with the updated family details; otherwise, it handles any exceptions and sends an error response appropriately.`,
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
