const { schema } = require('./schemas/response/getDefaultLocaleRest');
const { schema: xRequest } = require('./schemas/request/getDefaultLocaleRest');

const openapi = {
  summary: "Fetches the platform's default locale setting",
  description: `This endpoint retrieves the default locale configured for the platform. It identifies the primary language and regional settings that are used across various functionalities where localized content is required.

**Authentication:** Users do not need to be logged in to access the default locale. It is publicly accessible to provide a consistent user experience in terms of language and region right from the start of interaction with the platform.

**Permissions:** No specific permissions are required to access this endpoint. It serves general platform information which is intended to be freely accessible to all users, ensuring that localization preferences can be resolved and applied even before user authentication.

Upon receiving a request, the \`getDefaultLocaleRest\` action invokes the \`getDefaultLocale\` method from the platform core services. This method directly reads the locale configuration from the system settings, generally maintained in a configuration file or a database. The output of this method is the default locale setting such as 'en-US' or 'fr-FR', which is then returned to the requester in JSON format, ensuring that the client application can adjust its language and regional settings accordingly.`,
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
