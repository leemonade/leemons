const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove an educational center from the system',
  description: `This endpoint handles the deletion of an educational center from the platform's records. The action ensures that all associated data with the center, such as users, classes, and configurations, are also properly deleted or disassociated, maintaining data integrity and coherence within the platform.

**Authentication:** Users must be authenticated and possess the necessary session tokens to perform this operation. Unauthorized access will be prevented, and the system will respond with an appropriate error message indicating lack of authentication.

**Permissions:** Specific permissions are required to delete an educational center. Users attempting to perform this action must typically hold administrative rights or equivalent privileges within the system that explicitly allow for the deletion of such data.

Upon receiving the delete request, the endpoint calls the \`remove\` method from the \`centers\` core module. The \`remove\` method proceeds with various checks to ensure the requesting user has the required permissions and that the center specified in the request is valid and eligible for deletion. Dependent data relationships are handled carefully to avoid orphan records and ensure clean removal. Once the checks pass, the method executes the deletion process. On successful completion, the system acknowledges the removal with a success message and appropriate HTTP status. If any errors are encountered during the process, they are caught, and the service provides an error response detailing the issue encountered.`,
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
