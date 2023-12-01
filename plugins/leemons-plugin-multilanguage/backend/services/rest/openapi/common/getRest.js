const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Provides multilanguage support for text resources',
  description: `This endpoint allows the retrieval and management of multilanguage text resources. It offers functionality to query and manipulate text translations across different languages within the Leemons SaaS platform.

**Authentication:** Access to this endpoint requires the user to be authenticated. Unauthorized access will be rejected.

**Permissions:** Users need to have the appropriate translation management permissions to utilize this endpoint. Without these permissions, access to multilanguage functionalities will be restricted.

During the processing of a request, this endpoint may initiate by calling a method such as \`listLanguages\` to gather all available languages supported by the platform. Subsequently, it might invoke a \`getTranslations\` method, providing it with necessary parameters such as locale identifiers and text keys to fetch the corresponding translations. Upon successfully retrieving the translations, the controller may proceed to format and return the data in a structured response, typically in JSON format, encompassing all requested multilanguage information. Throughout its flow from request to response, the controller ensures proper authorization, validation of input parameters, and consistent error handling to facilitate robust multilanguage support.`,
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
