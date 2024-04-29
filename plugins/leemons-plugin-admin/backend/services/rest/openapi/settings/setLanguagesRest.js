const { schema } = require('./schemas/response/setLanguagesRest');
const { schema: xRequest } = require('./schemas/request/setLanguagesRest');

const openapi = {
  summary: 'Set the available languages for the platform',
  description: `This endpoint configures the available languages that can be used across the platform. It is typically called when setting up the platform initially or when languages need to be added or updated.

**Authentication:** Users must be authenticated as platform administrators to modify the language settings. Authentication ensures that only authorized personnel can make changes to foundational configurations such as languages.

**Permissions:** The endpoint requires administrative privileges. It explicitly checks that the user has the 'manage_languages' permission before proceeding with updates.

Upon receiving a request, the 'setLanguagesRest' handler in \`settings.rest.js\` first validates the presence and format of the language data in the request body. It then calls the \`setLanguages\` method in the \`settings\` core module, passing along the language information. This method updates the language settings in the platform's configuration repository, ensuring compliance with the new settings. Once the update is successful, a confirmation response is sent back, and the platform begins to support the newly configured languages.`,
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
