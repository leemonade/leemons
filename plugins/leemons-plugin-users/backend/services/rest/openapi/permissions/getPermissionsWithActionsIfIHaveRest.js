const {
  schema,
} = require('./schemas/response/getPermissionsWithActionsIfIHaveRest');
const {
  schema: xRequest,
} = require('./schemas/request/getPermissionsWithActionsIfIHaveRest');

const openapi = {
  summary: 'Check and retrieve permissions for user-controlled actions',
  description: `This endpoint evaluates and provides all permissions related to actions that a user can perform within the system, based on their current authentication and authorization status. It specifically fetches any permissions that are associated with actionable items or functions that the user has potential access to.

**Authentication:** Users need to be authenticated to request and receive information about their actionable permissions. Without proper authentication, the endpoint will not provide any permissions data.

**Permissions:** The user must possess sufficient access rights to inquire about their permissions. Typically, this requires user-level or elevated permissions depending on the structure and sensitivity of the permissions being inquired.

The handling of the request begins by utilizing the \`getUserAgentPermissions\` function from the \`user-agents\` core, which extracts the permissions based on the user's credentials. This function checks the database for all permissions linked to the user agent's ID. Subsequently, actions and their respective permissions are verified through a series of internal checks and balances to ensure that only relevant and permissible actions are returned to the user. The response is then compiled into a structured format, detailing each actionable permission and sent back through the endpoint in a JSON object format.`,
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
