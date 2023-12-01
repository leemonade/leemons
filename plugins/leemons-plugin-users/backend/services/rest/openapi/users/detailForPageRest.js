const { schema } = require('./schemas/response/detailForPageRest');
const { schema: xRequest } = require('./schemas/request/detailForPageRest');

const openapi = {
  summary: 'Provides detailed page-specific user profile information',
  description: `This endpoint delivers a comprehensive user profile customized for page-specific requirements. It enriches the standard user details with additional information pertinent to the rendering of a user's profile page or dashboard within the application.

**Authentication:** User authentication is mandatory for accessing this endpoint. Only requests with a valid, authenticated session will be served.

**Permissions:** Access to this endpoint is subject to user-specific permissions that determine the level of detail provided about the user's profile based on the roles and privileges granted to them within the system.

Upon receiving a request, the \`detailForPageRest\` handler initiates a sequence of operations starting with the verification of the user's authentication status and permissions. Once access is granted, it employs the \`detailForPage\` method from the \`users\` core service which collects and structures all relevant profile information. This includes personal details, settings, and any other user-specific data that would be necessary for a detailed page view. Subsequently, it might also invoke additional services or methods, such as \`getUserDatasetInfo\` or \`getUserPreferences\`, to retrieve user-specific configurations and preferences. The compiled user profile data is then returned in the response body in a structured and consumable JSON format for the client-side application to utilize in rendering the user's profile page.`,
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
