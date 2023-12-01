const { schema } = require('./schemas/response/updateSessionConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/updateSessionConfigRest');

const openapi = {
  summary: 'Updates the user session configuration',
  description: `This endpoint allows for the updating of session configurations for the user. This can include settings such as session timeouts, session renewal intervals, and other related configurations that affect how user sessions are managed within the system.

**Authentication:** Users need to be authenticated and have a valid session in order to update their session configurations. Unauthenticated requests will be rejected.

**Permissions:** Users must have the 'manage_session_config' permission to update their session settings. Attempts to update session configurations without adequate permissions will result in an error.

Upon receiving a request, the handler first verifies the user's authentication status and permissions. If the validation passes, it calls the \`updateSessionConfig\` method from the \`users\` core module. This method is responsible for applying the new session configurations to the user's profile. It handles the necessary validation of the provided settings and the persistence of these settings to the database. The process ensures that the changes are consistent and safely stored. Finally, the endpoint responds with a success message and the updated configuration details, or with an appropriate error message if the operation fails.`,
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
