const { schema } = require('./schemas/response/sharePackageRest');
const { schema: xRequest } = require('./schemas/request/sharePackageRest');

const openapi = {
  summary: 'Share a SCORM package with specified users or groups',
  description: `This endpoint allows sharing of a SCORM package within the leemonade platform to selected users or groups. The sharing action, facilitated by this controller, makes a specific package available to others for their use in learning or training contexts.

**Authentication:** Users must be authenticated to share SCORM packages. The action checks for a valid session or authentication token to proceed.

**Permissions:** Users need to have 'share_package' permission to execute this action. Without this permission, the request will be denied.

The handler initiates its process by calling the \`sharePackage\` method from the \`package\` core with parameters for user IDs and/or group IDs. This method checks the existence of the package and validates the user's permission to share it. On successful validation, it updates the sharing settings in the database to reflect the new shared status with specified entities. It uses database transactions to ensure that all changes are accurate and consistent. After the sharing settings are successfully updated, it returns a success response indicating that the package has been shared.`,
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
