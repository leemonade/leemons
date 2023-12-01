const { schema } = require('./schemas/response/getRememberLoginRest');
const { schema: xRequest } = require('./schemas/request/getRememberLoginRest');

const openapi = {
  summary: 'Manage remember-me login functionality',
  description: `This endpoint is responsible for processing remember-me login tokens, allowing users to be automatically logged in on subsequent visits without the need for manual authentication.

**Authentication:** The endpoint can be accessed without the user being logged in, as its primary function is to facilitate login for users with a remember-me token.

**Permissions:** No specific permissions are required to invoke this endpoint; however, it is implicitly understood that a valid remember-me token is necessary to authenticate and gain access.

Upon receipt of a request, the handler begins by attempting to validate the remember-me login token provided by the user. If the token is valid, the handler locates the corresponding user account in the system and generates an authentication session. This session includes issuing a new JWT (JSON Web Token) and setting up the appropriate user context for the session. Subsequently, the system updates any necessary login statistics, such as the last login time. The process culminates with the user being returned a success response, which signifies a successful login, along with the new JWT for maintaining the session on the client-side.`,
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
