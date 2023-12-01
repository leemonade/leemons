const { schema } = require('./schemas/response/loginRest');
const { schema: xRequest } = require('./schemas/request/loginRest');

const openapi = {
  summary: 'User authentication and token generation',
  description: `This endpoint is responsible for authenticating a user with their credentials and generating a valid JSON Web Token (JWT) that will be used for subsequent requests to identify and authorize the user.

**Authentication:** No prior authentication is required to access this endpoint as it is used to obtain the initial authentication token.

**Permissions:** There are no specific permissions required to call this endpoint, as any user with valid credentials can attempt to log in.

Upon receiving the login request, the handler method \`loginRest\` is triggered within the users service. It starts by validating the provided credentials, such as the username and password, against the stored user information in the database. Once the credentials are validated, the endpoint processes the login using the \`login\` action from the \`users\` core. If the credentials match an existing user, the \`generateJWTToken\` method is called to create a new JWT for the session management. The generated token contains claims that identify the user and may include additional metadata for the session. Finally, the handler responds with an object containing the JWT, indicating a successful login, or it returns an error message with appropriate HTTP status codes if the login attempt fails.`,
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
