const { schema } = require('./schemas/response/setRest');
const { schema: xRequest } = require('./schemas/request/setRest');

const openapi = {
  summary: 'Set user profile parameters',
  description: `This endpoint allows for the update or creation of a user's profile settings in the system. This function ensures that user preferences and settings are accurately recorded and maintained across sessions.

**Authentication:** User authentication is mandatory to access and modify profile settings. Without proper authentication, the system denies any operations on profile settings.

**Permissions:** The user must have the 'edit_profile' permission to update profile settings. Without this permission, the attempt to update or set profile settings will be blocked, ensuring that only authorized users can make changes to their profiles.

The endpoint works by invoking the \`set\` method in the \`Profiles\` core. This method handles both updating existing profile settings and creating new ones if they do not already exist. The process involves validating the input data against pre-defined schemas and then either updating the existing profile or inserting a new entry into the database. The entire operation is wrapped in transaction controls to ensure data integrity and consistency. After successful execution, the updated settings are returned in the response, providing instant confirmation to the user about the changes.`,
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
