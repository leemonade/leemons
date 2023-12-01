const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update user profile information',
  description: `This endpoint updates the profile details for a specific user within the system, ensuring that the user's information remains current and accurate.

**Authentication:** Users need to be successfully authenticated to invoke this endpoint. Without proper authentication, the user's request to update their profile will be denied.

**Permissions:** Specific permissions are required to update a user's profile. The user should have rights to modify profile data or hold a role with sufficient privileges to update profiles on behalf of other users.

Upon receiving a request, the \`updateRest\` handler first validates the current user's authentication and authorization to perform profile updates. If validated, it then proceeds to call the \`update\` method found in the 'profiles' core module (\`/backend/core/profiles/update.js\`). Inside the \`update\` method, it checks if the profile name already exists using the \`existName\` method (\`/backend/core/profiles/existName.js\`). If the new profile name is unique, it updates the profile's information, including localized translations using the \`updateProfileTranslations\` method (\`/backend/core/profiles/updateProfileTranslations.js\`). After successful update, it marks all users associated with the profile to reload their permissions through \`markAllUsersWithProfileToReloadPermissions\` (\`/backend/core/profiles/permissions/markAllUsersWithProfileToReloadPermissions.js\`). The response to the client signifies the completion of the profile update process.`,
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
