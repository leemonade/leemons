const { schema } = require('./schemas/response/getLanguagesRest');
const { schema: xRequest } = require('./schemas/request/getLanguagesRest');

const openapi = {
  summary: 'Fetch available languages configuration',
  description: `This endpoint retrieves the configuration details of all available languages within the system. This includes active languages and their respective codes, names, and possibly other locale-related settings.

**Authentication:** The user must be logged in to retrieve language settings. Unauthorized access will result in a denial of the request.

**Permissions:** Users need to have adequate permission to access the system's language configurations. Typically, this would entail administrative-level access or specific privileges related to system configuration and localization.

Upon receiving a request, the \`getLanguagesRest\` handler calls the \`getLanguages\` function from the \`settings\` module in the admin plugin core. This function is responsible for fetching the list of all languages that have been set up in the application, along with their respective details. The information is retrieved from the application's data store where language settings are maintained. The handler then formats and returns this data as a JSON object in the HTTP response, providing the client with the necessary localization options.`,
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
