const { schema } = require('./schemas/response/getLocalesRest');
const { schema: xRequest } = require('./schemas/request/getLocalesRest');

const openapi = {
  summary: 'Provides localized content for the platform',
  description: `This endpoint retrieves all available language locales supported by the platform. It enables applications to offer multilingual support by providing a list of locales that users can select from to view content in their preferred language.

**Authentication:** Users are required to be authenticated to access the list of supported locales. Unauthenticated requests are rejected, ensuring that only valid users can access locale information.

**Permissions:** Access to this endpoint requires administrative rights. Only users with the 'admin' role are permitted to retrieve the list of locales, ensuring that managing available locales is restricted to authorized personnel only.

Upon receiving a request, the \`getLocales\` function within the platform's core is invoked. This function queries the system's configuration files or database to gather all supported locales. The process involves validating the user's authentication and permissions before proceeding with the data retrieval. Finally, the gathered data is returned in a JSON array format, listing each locale along with its relevant properties such as language code and description, facilitating easy integration and selection by users.`,
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
