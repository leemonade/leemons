const { schema } = require('./schemas/response/getLoggedRest');
const { schema: xRequest } = require('./schemas/request/getLoggedRest');

const openapi = {
  summary: "Retrieve current user's locale settings",
  description: `This endpoint provides the locale settings of the currently logged-in user. These settings include language preferences, formatting conventions, and other localization data relevant to the user interface.

**Authentication:** Users must be authenticated to access their localization settings. Any request without a valid authentication credential will be rejected.

**Permissions:** The endpoint requires 'view_locale_settings' permission, ensuring that only users with appropriate rights can retrieve their locale information.

The process begins with the \`getLoggedRest\` method in the \`common.rest.js\` service file. The method first validates the existence of a session or token proving user authentication. Once authenticated, it checks for the required permissions using the Leemon's authorization services. If the checks are successful, the method interacts with the \`getLocaleSettings\` function from the \`users\` core, which extracts and compiles the user's current localization configurations from the database. This compiled data is then formatted and returned in a structured JSON format, echoing the user's locale preferences and settings.`,
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
