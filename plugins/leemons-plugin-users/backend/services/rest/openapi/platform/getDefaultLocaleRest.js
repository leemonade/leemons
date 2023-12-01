const { schema } = require('./schemas/response/getDefaultLocaleRest');
const { schema: xRequest } = require('./schemas/request/getDefaultLocaleRest');

const openapi = {
  summary: "Get the platform's default locale setting",
  description: `This endpoint retrieves the platform's default locale configuration, which is used as a fallback when no specific user locale is set or when localized content is requested without specifying a locale.

**Authentication:** Users are not required to be logged in to fetch the platform's default locale setting as this information is not user-specific and may be needed for public-facing interface components.

**Permissions:** No explicit permissions are needed to access the default locale setting since it is part of the platform's public configuration parameters.

Upon receiving the request, the handler calls the \`getDefaultLocale\` function from the \`platform\` core module. This function is responsible for accessing the platform's settings and extracting the default locale configuration. It may involve reading from the database or accessing a cached configuration value. Once the default locale is obtained, it's returned to the requester in a JSON formatted response.`,
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
