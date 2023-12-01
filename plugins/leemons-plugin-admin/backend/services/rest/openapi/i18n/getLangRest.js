const { schema } = require('./schemas/response/getLangRest');
const { schema: xRequest } = require('./schemas/request/getLangRest');

const openapi = {
  summary: 'Fetches available languages for the application interface',
  description: `This endpoint fetches a list of the currently supported language locales for the application's user interface, enabling dynamic language selection and localization features.

**Authentication:** Access to this endpoint does not require user authentication, as it provides general information about the available languages that can be useful for any user, regardless of their authentication status.

**Permissions:** There are no specific permissions needed to retrieve the list of available languages. This data is considered public and available to all users to ensure they can navigate and utilize the application interface in their preferred language.

Upon receiving a request, the handler initiates the \`getLangRest\` action that queries the internal configuration or the database to collect information about all available language locales. This information may include language codes, display names, and possibly directionality (e.g., left-to-right or right-to-left text). It compiles this information into a structured format and returns it to the requester in a JSON object. This enables the front-end interface to present language options appropriately to the user and to switch languages as needed at runtime.`,
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
