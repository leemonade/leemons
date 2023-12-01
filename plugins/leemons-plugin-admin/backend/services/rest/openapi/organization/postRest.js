const { schema } = require('./schemas/response/postRest');
const { schema: xRequest } = require('./schemas/request/postRest');

const openapi = {
  summary: 'Manages organizational settings and configurations',
  description: `This endpoint is responsible for handling organization-related configurations, including updating settings, retrieving organization details, and managing organizational themes. It serves as a centralized point for administrative procedures pertaining to the organization's account within the platform.

**Authentication:** All requests to this endpoint require the user to be authenticated. Access will be denied if the user's session is not valid or if the authentication credentials provided are incorrect.

**Permissions:** Users must have administrative privileges within the organization to make any changes or retrieve sensitive organizational information. The specific permission set required will depend on the operation being performed by the handler.

Upon receiving a request, the \`postRest\` action within the \`organization.rest.js\` service starts by parsing any incoming data to understand the context and intent of the API call. It then delegates the request handling to various methods within the \`leemons-plugin-admin\` core such as \`getOrganization\`, \`updateOrganization\`, and \`getJsonTheme\` for fetching and updating organizational details, or \`compileTokens\` and \`transform\` for theme-related operations. Each of these methods encapsulates specific business logic for dealing with organizational data, ensuring that the correct procedures are followed and the data integrity is maintained. Additionally, they might interact with the database and other services for data retrieval and persistence. The outcome of these operations is then formatted as per the API contract and returned to the client in a structured JSON response.`,
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
