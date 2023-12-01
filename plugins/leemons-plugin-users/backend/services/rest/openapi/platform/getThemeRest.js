const { schema } = require('./schemas/response/getThemeRest');
const { schema: xRequest } = require('./schemas/request/getThemeRest');

const openapi = {
  summary: 'Fetch current platform theme settings',
  description: `This endpoint retrieves the theme settings currently applied to the platform. It allows users to understand the visual configuration and branding information that has been set for the platform experience.

**Authentication:** The user must be logged in to access the theme settings. An access check is performed to ensure valid user credentials are provided.

**Permissions:** The user needs to have 'read theme settings' permissions to use this endpoint. Without the appropriate permissions, the user will receive an authorization error.

The endpoint initiates the process by calling the \`getTheme\` function from the platform core module. This function is responsible for accessing the system configuration and returning the specific theme settings that include visual elements such as colors, fonts, and other related styling preferences. The service behind this endpoint then formats these settings into a JSON object which is presented to the user as the HTTP response. It ensures that the data reflects the current theme accurately and is presented in a user-friendly format for any client applications.`,
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
