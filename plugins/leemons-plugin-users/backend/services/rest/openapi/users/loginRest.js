const { schema } = require('./schemas/response/loginRest');
const { schema: xRequest } = require('./schemas/request/loginRest');

const openapi = {
  summary: 'Authenticate and generate session token for user',
  description: `This endpoint handles user authentication processes including validating user credentials and generating a session token. The token can then be used for subsequent requests that require user authentication.

**Authentication:** No prior authentication is needed for this endpoint since its primary function is to authenticate users.

**Permissions:** This endpoint requires no explicit permissions since it is accessible to any user who needs to authenticate.

Upon receiving the request, the endpoint first validates the provided user credentials against stored records using the \`comparePassword\` method. If the credentials are valid, the \`generateJWTToken\` method is invoked to create a new JWT token. This token encapsulates the user's identity and permissions, enabling authorized access to protected resources. The response, if successful, includes the JWT token and perhaps other user-related information essential for subsequent interactions with the API.`,
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
