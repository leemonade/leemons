const { schema } = require('./schemas/response/setRest');
const { schema: xRequest } = require('./schemas/request/setRest');

const openapi = {
  summary: 'Set user-defined profile data',
  description: `This endpoint allows the creation or updating of custom profile data for a user within the system. Users can define additional information related to their profiles which might not be covered by the default fields provided by the platform.

**Authentication:** Users must be authenticated to modify their profile data. An authenticated session is required, and any attempt to set profile data without it will be blocked.

**Permissions:** The user needs to possess the 'edit_profile_data' permission to carry out this action. Without the required permission, the system will reject the request to set profile data.

Upon receiving the request, the \`setRest\` handler initiates by validating the presence of user authentication and required permissions. It then calls the \`set\` method in the 'profiles/set.js' core module to process the incoming data. This method interacts with the underlying database or data management system to either create new profile entries or update existing ones with the provided data. A successful operation will return a confirmation message, while failure cases—such as validation errors or insufficient permissions—are handled gracefully to inform the user of the exact issue encountered.`,
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
