const {
  schema,
} = require('./schemas/response/addAllPermissionsToAllProfilesRest');
const {
  schema: xRequest,
} = require('./schemas/request/addAllPermissionsToAllProfilesRest');

const openapi = {
  summary: 'Assign all available permissions to all user profiles',
  description: `This endpoint globally updates all user profiles in the system by assigning all available permissions to them, ensuring every profile has access to every permission defined in the system.

**Authentication:** User authentication is mandatory to execute this action. The service checks for valid session tokens before processing the request.

**Permissions:** The user must have administrative permissions to update permissions across all profiles.

Upon receiving a request, the handler invokes the \`addAllPermissionsToAllProfiles\` method from the \`profiles\` core module. This method iterates over all profiles stored in the database, and for each profile, it applies a set of predefined permissions. The permissions are retrieved from a central repository of permissions that define all possible actions users can perform within the system. This comprehensive application ensures that there are no discrepancies in permission assignments across different user profiles. Once all profiles are updated, a confirmation is sent back to the client indicating the successful update of permissions across all profiles.`,
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
