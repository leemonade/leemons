const { schema } = require('./schemas/response/profilesRest');
const { schema: xRequest } = require('./schemas/request/profilesRest');

const openapi = {
  summary: 'Manage user profiles and settings',
  description: `This endpoint allows for the management and retrieval of user profiles, including settings related to user preferences and security configurations. It serves as a central point for user-related information handling within the system.

**Authentication:** Users need to be authenticated in order to access and manipulate their profile data. Authentication verification is required to ensure secure access to personal information.

**Permissions:** Adequate permissions are required to access or modify different levels of user profile information. Specific roles or privileges determine the extent of data that can be managed or viewed. Permissions checks are integral to secure and appropriate data access.

The process begins with the \`profilesRest\` handler, which interacts with multiple backend services to fetch or update user details. Calls may include fetching user data from the database, updating security settings, and managing user preferences. Each action within the handler is secured and validated against user permissions and authentication status, ensuring that only authorized actions are performed. The response is systematically formatted to reflect the result of the requested operation, whether it's data retrieval or a confirmation of updates made.`,
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
