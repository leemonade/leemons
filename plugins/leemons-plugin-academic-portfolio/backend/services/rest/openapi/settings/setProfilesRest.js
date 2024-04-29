const { schema } = require('./schemas/response/setProfilesRest');
const { schema: xRequest } = require('./schemas/request/setProfilesRest');

const openapi = {
  summary: 'Set user academic profiles',
  description: `This endpoint sets or updates the academic profiles for a specific user. It primarily handles profile creation and modification activities within the user's academic portfolio.

**Authentication:** User authentication is required to access and modify academic profiles. Authentication is validated via user tokens, and any operations without proper authentication will be rejected.

**Permissions:** The user needs to have the 'edit_academic_profile' permission to modify profiles. Lack of sufficient permissions will prevent the user from performing updates on academic profiles.

The flow of the endpoint begins with the validation of user authentication and permissions. Upon successful validation, the \`setProfiles\` method from the \`Settings\` core module is invoked. This method takes the input payload containing profile data and processes updates or creations based on the supplied details. If the operation is successful, the method returns an acknowledgment of the changes. The entire process ensures that only authorized and authenticated users can alter academic profiles, maintaining data integrity and security within the system.`,
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
