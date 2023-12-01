const { schema } = require('./schemas/response/isProfilesConfigRest');
const { schema: xRequest } = require('./schemas/request/isProfilesConfigRest');

const openapi = {
  summary: 'Checks profile configuration status',
  description: `This endpoint checks if the academic profiles are correctly configured within the system. It provides a boolean status indicating the configuration state, which helps in determining if additional setup steps are needed or if the system is ready to manage academic portfolios.

**Authentication:** Users must be authenticated to check the profile configuration status. An authentication mechanism is in place to ensure that only authorized users can perform this check.

**Permissions:** Users need to have appropriate permissions to verify profile configuration, as this endpoint may expose sensitive system state information.

Upon receiving a request, the handler \`isProfilesConfigRest\` calls the \`isProfilesConfig\` function from the \`settings\` core module. This function performs a series of checks to ascertain if profiles are set up according to defined criteria. The criteria might include the existence of necessary data structures, completed profile settings, and the proper association of these profiles with relevant user or entity data within the academic portfolio module. Once the checks are complete, the result—a boolean value—is sent back to the requester, either confirming the proper configuration or indicating that further setup is needed.`,
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
