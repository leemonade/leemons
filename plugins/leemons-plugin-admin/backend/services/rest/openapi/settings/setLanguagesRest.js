const { schema } = require('./schemas/response/setLanguagesRest');
const { schema: xRequest } = require('./schemas/request/setLanguagesRest');

const openapi = {
  summary: "Set the platform's available languages",
  description: `This endpoint updates the list of languages that are available for the platform. Administrators use this feature to manage the languages users can select from within the platform settings.

**Authentication:** This action requires the user to be authenticated. Without proper authentication, the endpoint cannot be accessed and will return an unauthorized error.

**Permissions:** Users need to have the 'manage_languages' permission to execute this operation. Any attempt by a user without this permission will result in an access denied response.

Upon receiving the request, the \`setLanguagesRest\` handler performs an initial permission check to ensure the user has the necessary rights to manage languages. If they do, it then proceeds to invoke the \`setLanguages\` method from the \`settings\` core. The \`setLanguages\` method applies business logic to validate the submitted languages array, and interacts with the underlying data store to update the list of available languages. After the database has been successfully updated, the endpoint responds with a confirmation message indicating the operation's success, along with the updated languages list, or returns an error message if the update fails.`,
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
