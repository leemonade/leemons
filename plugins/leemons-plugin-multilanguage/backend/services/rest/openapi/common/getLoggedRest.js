const { schema } = require('./schemas/response/getLoggedRest');
const { schema: xRequest } = require('./schemas/request/getLoggedRest');

const openapi = {
  summary: "Fetch current user's multilingual configurations",
  description: `This endpoint allows the retrieval of all language-related settings and configurations for the currently logged-in user. It typically involves fetching language preferences, available translations, and any user-specific language data.

**Authentication:** Only logged-in users can access their multilingual configurations. Users must provide a valid authentication token to be authorized to make this request.

**Permissions:** Access to this endpoint may require the user to have specific privileges such as 'view_multilanguage_settings'. The endpoint will perform checks to ensure the user has the necessary permissions to access the language configurations.

Upon receiving a request, the \`getLogged\` action in the \`common.rest.js\` service begins by verifying the user's authentication and permissions. Assuming the user is authenticated and has the correct permissions, the handler proceeds to invoke the \`getLocaleSettings\` method from the \`locale\` core module, supplying it with the user's identification context. The method performs a query to the underlying data store to retrieve the user's language preferences and any related configurations. Once the data is fetched, it is formatted appropriately for the response and sent back to the user in JSON format, providing a comprehensive view of the user's multilanguage settings.`,
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
