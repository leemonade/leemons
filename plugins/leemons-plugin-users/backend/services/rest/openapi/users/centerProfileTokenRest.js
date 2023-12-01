const { schema } = require('./schemas/response/centerProfileTokenRest');
const {
  schema: xRequest,
} = require('./schemas/request/centerProfileTokenRest');

const openapi = {
  summary: 'Generate a token for the user’s center profile',
  description: `This endpoint generates a personalized token tied to the user's center profile, which is typically required for operations related to a specific center that the user is associated with. The token uniquely identifies the user's roles and permissions within the context of that center.

**Authentication:** User must be authenticated to generate a token for their center profile. A valid session or user token is required, and attempts to generate a token without authentication will be rejected.

**Permissions:** User needs to have appropriate permissions within the center for which the token is being generated. The specific permissions required depend on the center's configuration and the user's role within that center.

Upon receiving the request, the handler calls the \`centerProfileToken\` method, which checks the user's session data and their association with the requested center. It validates the user's roles and permissions in that context and generates a token using cryptographic methods. This token encodes the user's access level, roles, and any specific permissions granted within the center. The token is then returned to the user in the response, which they can use for subsequent requests to verify their center-specific access rights.`,
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
