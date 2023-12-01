const {
  schema,
} = require('./schemas/response/addAllPermissionsToAllProfilesRest');
const {
  schema: xRequest,
} = require('./schemas/request/addAllPermissionsToAllProfilesRest');

const openapi = {
  summary: 'Grant all available permissions to all user profiles',
  description: `This endpoint assigns all the existing permissions within the system to all user profiles, effectively giving them full access to all features and functions of the platform.

**Authentication:** User must be authenticated and possess administrative rights to execute this operation. Unauthorized access is strictly prevented, and authentication is mandatory for accessing this endpoint.

**Permissions:** This endpoint requires elevated privileges, specifically 'admin' rights, as it will grant extensive permissions across all profiles. Only users with a role that includes administrative permissions management can invoke this action.

The handler begins its execution by calling the \`addAllPermissionsToAllProfiles\` method defined in 'profiles' core. This method iterates over all user profiles and assigns to each profile all the permissions that are registered in the system. It's a broad operation that should be used cautiously, as it overrides the current permissions set. Subsequent to successfully updating the permissions, the method marks all users attached to those profiles to reload their permissions, ensuring their sessions reflect the changes immediately. The response will usually indicate a success status and may include a list of affected profiles or a confirmation message.`,
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
