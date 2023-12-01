const { schema } = require('./schemas/response/getJsonThemeRest');
const { schema: xRequest } = require('./schemas/request/getJsonThemeRest');

const openapi = {
  summary: 'Get the JSON representation of the theme',
  description: `This endpoint allows retrieval of the JSON representation of the organization's theme configuration. It provides the theme's structured data including colors, typography, and other UI/UX elements for client-side rendering.

**Authentication:** Users need to be authenticated to request the organization's theme JSON. Unauthenticated requests will be rejected.

**Permissions:** Users need to have 'read_theme' permission to access this endpoint. Otherwise, they will receive a permission error.

Upon a request being made to this endpoint, the handler commences by executing the \`getJsonTheme\` function, which is found within the 'theme' core module. This function is responsible for obtaining the current theme settings applied to the organization. The function consults the database for the existing theme configurations and constructs a JSON object reflecting all thematic elements. Finally, the resultant JSON is returned to the requester in the response body, giving front-end services the necessary information to correctly apply the organization's visual styling.`,
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
