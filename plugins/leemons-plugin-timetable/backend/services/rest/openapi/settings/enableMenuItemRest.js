const { schema } = require('./schemas/response/enableMenuItemRest');
const { schema: xRequest } = require('./schemas/request/enableMenuItemRest');

const openapi = {
  summary: 'Enables a specific menu item within the timetable',
  description: `This endpoint allows the enabling of a previously disabled menu option associated with the timetable functionality in the platform.

**Authentication:** User authentication is required to perform this action. Any unauthenticated requests will be denied.

**Permissions:** Appropriate permissions are necessary to enable menu items in the timetable. The user must possess the 'manage_timetable_settings' permission to proceed.

Upon receiving a request, the handler first verifies the user's authentication status and permission level. Assuming these checks pass, it calls the \`enableMenuItem\` function with necessary parameters to identify which menu item should be enabled. The function updates the relevant configuration setting in the database to reflect the change, effectively making the menu item active and accessible again for users with the adequate role or permission level. The handler then returns a confirmation of the action, typically as a simple success message, or it provides appropriate error handling feedback should the process encounter any issues.`,
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
