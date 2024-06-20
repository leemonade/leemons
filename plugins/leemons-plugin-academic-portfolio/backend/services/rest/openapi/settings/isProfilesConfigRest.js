const { schema } = require('./schemas/response/isProfilesConfigRest');
const { schema: xRequest } = require('./schemas/request/isProfilesConfigRest');

const openapi = {
  summary: 'Check if user profile settings are configured',
  description: `This endpoint examines the system's configuration to determine if the profile settings for a user have been correctly set up and configured. It primarily checks the presence and validity of certain user-specific configurations which are essential for further operations and access within the academic portfolio plugin.

**Authentication:** Users need to be authenticated to check their profile configuration status. Any request without a valid session or authentication token will be rejected.

**Permissions:** This action requires administrator-level permissions, as it involves accessing sensitive configuration data that could influence the accessibility and functionality of user profiles across the platform.

Upon receiving a request, the handler initiates by calling the \`isProfilesConfig\` method from the Settings core. This method assesses whether the user profiles have all necessary configurations set based on predefined criteria stored within the system. It checks various configuration parameters and ensures they align with the required standards for a proper operational environment. The method returns a boolean indicating the existence and correctness of these configurations. The response communicated back to the client provides clear information on the configuration status, facilitating further user or admin actions based on the outcome.`,
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
