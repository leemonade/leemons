const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Provides multilingual support by managing localization data',
  description: `This endpoint manages localization configurations and translations across different languages, ensuring that end-users experience a customizable interface based on their selected language preference.

**Authentication:** User authentication is mandatory to access this endpoint. Unauthorized access is prevented, and only authenticated sessions will proceed with requests handling.

**Permissions:** Appropriate permissions need to be granted for users to manipulate localization settings. Users must have the 'manage_localization' permission to update or fetch localization data.

This endpoint initiates its process by gathering key-value pairs from localization files or databases, which contain translation strings mapped to particular language keys. It uses caching mechanisms to enhance performance by reducing load times during the retrieval of these localizations. Depending on the request details, the \`getLocalizations\`, \`getLocalizationsByKeys\`, or \`getLocalizationsByKeysStartsWith\` functions from the 'globalization' core module are invoked. These functions are responsible for accessing detailed localization data, filtering it based on the provided keys or patterns, and ensuring the data is up-to-date before it is sent back to the client. The final output is then structured in a JSON format, containing the relevant localization data that aligns with the requested language settings.`,
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
