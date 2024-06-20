const { schema } = require('./schemas/response/getJsonThemeRest');
const { schema: xRequest } = require('./schemas/request/getJsonThemeRest');

const openapi = {
  summary: 'Fetches the theme configuration for the organization',
  description: `This endpoint facilitates the retrieval of the current theme configuration JSON specific to the organization. This endpoint is typically used to support frontend operations that require theme data to customize user interfaces accordingly.

**Authentication:** Users need to be authenticated to ensure secure access to organizational themes. Access attempts without proper authentication will result in restricted entry.

**Permissions:** Users must possess adequate permission levels, typically admin rights, to fetch theme configurations. This ensures that only authorized personnel can access sensitive theme information.

Upon receiving a request, the handler initiates by calling the \`getJsonTheme\` method within the \`organization\` core module. This method is responsible for extracting the theme details from the organization's configuration settings stored in the database. It processes the request by validating user credentials and permissions before serving the theme JSON. The method provides a comprehensive pipeline that includes fetching, validating, and returning the necessary data packaged in a structured JSON format to the requesting client.`,
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
