const {
  schema,
} = require('./schemas/response/getPermissionsWithActionsIfIHaveRest');
const {
  schema: xRequest,
} = require('./schemas/request/getPermissionsWithActionsIfIHaveRest');

const openapi = {
  summary: 'Gets permissions with actionable context for the user agent',
  description: `This endpoint provides a set of permissions alongside the actions the current user agent is allowed to perform. Each permission comes with context to help understand where and how it can be applied.

**Authentication:** Users need to be authenticated to retrieve permissions. An authenticated session is required, and the endpoint will reject requests from unauthenticated users.

**Permissions:** The endpoint requires the user to have adequate rights to request permissions data. Specific permission checks are performed to verify if the user agent holds the necessary rights to access the actionable permissions information.

Upon receiving a request, the endpoint firstly validates the user agent's authentication status. Assuming the authentication is valid, it proceeds to check the user's permissions to ensure they are authorized to access this data. After successfully passing the authentication and permission validations, the handler will call the \`getUserAgentPermissions\` method from the \`UserAgentPermissions\` core, which retrieves all the permissions and actions available to the user agent. The method performs an assessment of the user's roles and associated permissions, then returns a detailed list of those permissions, including each action the user is allowed to take. Following this, the endpoint will respond with a structured listing of these permissions and actions in a JSON response.`,
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
