const { schema } = require('./schemas/response/removeRememberLoginRest');
const {
  schema: xRequest,
} = require('./schemas/request/removeRememberLoginRest');

const openapi = {
  summary: 'Remove remember-me login data for a user',
  description: `This endpoint allows for the removal of persistent login data associated with the 'remember-me' feature of a user's account. By invoking this operation, the server will invalidate any tokens or credentials that enable automatic user authentication.

**Authentication:** User authentication is required to ensure that the request to disable the 'remember-me' feature comes from the authenticated user or an administrator with relevant privileges.

**Permissions:** The user must have the permission to manage their own login settings, or an administrator must have the necessary permissions to alter login settings for other users.

Upon receiving a request, the handler begins by verifying the authentication and permissions of the requesting party. It then proceeds to call the function responsible for finding and deleting the 'remember-me' tokens or entries from the persistent store, such as a database or cache. If the operation is successful, the user's 'remember-me' ability is disabled, and they will be required to manually input their login credentials during their next session. The system ensures to handle appropriate error states, such as when the data cannot be found or the user does not have sufficient rights. The response to the client will confirm the completion of the process or report any errors encountered.`,
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
