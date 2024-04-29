const { schema } = require('./schemas/response/getThemeRest');
const { schema: xRequest } = require('./schemas/request/getThemeRest');

const openapi = {
  summary: 'Fetches the current platform theme settings',
  description: `This endpoint retrieves the theme settings currently active for the platform. It provides the appearance configurations that dictate the visual aspects of the platform’s user interface.

**Authentication:** The user must be authenticated to access the theme settings. An invalid or missing authentication token will result in endpoint access denial.

**Permissions:** The user needs to have administrative permissions to access the theme settings. Without the required permissions, the endpoint will deny access to the theme configurations.

Once invoked, the \`getTheme\` handler in the backend service begins by confirming user authentication and checks for administrative permissions. If these checks pass, it then calls the \`getTheme\` method from the \`Platform\` core. This method accesses the database to retrieve the current theme settings applied to the platform. The results are then formatted and sent back as a JSON object representing the theme settings, ensuring that the administrator can view or modify the visual configurations as needed.`,
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
