const { schema } = require('./schemas/response/centersRest');
const { schema: xRequest } = require('./schemas/request/centersRest');

const openapi = {
  summary: 'Manages centers associated with user roles',
  description: `This endpoint handles the management and association of centers with different user roles within the platform. It is designed to facilitate the administration of access permissions and functionalities across different organizational structures in a multi-centered organization setup.

**Authentication:** Users need to be authenticated to manage centers tied to user roles. The system checks if the session contains a valid authentication token before proceeding with any operations.

**Permissions:** Users must possess administrative privileges or specific role management permissions to alter or manage center-role associations. Lack of adequate permissions will lead to access denial.

The flow begins with authentication verification to ensure active and legitimate session status. Post authentication, the system checks for specific permissions related to center and role management. If permissions are validated, the handler proceeds to invoke various core methods that manage the assignment or association of centers to different roles based on the rules defined in the business logic. These operations might include creating new associations, modifying existing ones, or listing centers based on role specifications. Each operation interacts with the database to retrieve or update information, ensuring that all changes are persistently reflected.`,
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
