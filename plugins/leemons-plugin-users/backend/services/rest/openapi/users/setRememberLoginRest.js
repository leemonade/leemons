const { schema } = require('./schemas/response/setRememberLoginRest');
const { schema: xRequest } = require('./schemas/request/setRememberLoginRest');

const openapi = {
  summary: 'Set Remember-Me login functionality preference',
  description: `This endpoint allows a user to set their preference for the Remember-Me functionality during login, which keeps the user logged in for a longer duration even after closing the browser.

**Authentication:** Users need to be authenticated to update their Remember-Me preference. An authentication token is required to verify the user's identity.

**Permissions:** The user must have the \`set_remember_login_preference\` permission to update this setting. Without the appropriate permission, the user will not be able to modify the Remember-Me preference.

To handle the request, the \`setRememberLoginRest\` action is invoked, initiating a series of method calls. First, it verifies the user's permission to set Remember-Me preferences through the \`canUpdateRememberMe\` method. Then, it uses the \`updateRememberMePreference\` method to store the user's preference in the database. The controller ensures the preference update is securely applied only to the account of the authenticated user. The response of this process is a success message or an appropriate error message reflecting the outcome of the request.`,
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
