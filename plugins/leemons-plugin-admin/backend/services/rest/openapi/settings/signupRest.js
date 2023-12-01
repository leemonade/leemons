const { schema } = require('./schemas/response/signupRest');
const { schema: xRequest } = require('./schemas/request/signupRest');

const openapi = {
  summary: 'Register a new user account',
  description: `This endpoint is responsible for registering a new user account in the system. It involves validating the provided user data, creating the new user account, and triggering any necessary post-registration events such as sending a welcome email or performing initial account setup tasks.

**Authentication:** User registration is typically open to any visitor without the need for prior authentication. Unless the system is configured to restrict sign-ups, no authentication token is needed to access this endpoint.

**Permissions:** This endpoint does not require any special permissions since it's intended for unregistered users to create a new account. Access may be limited if the system is configured to restrict public registrations.

Upon receiving a request, the \`signupRest\` handler validates the input against a predefined schema to ensure that all required fields are present and conform to the expected formats. Following validation, the handler calls upon the \`registerUser\` method in the underlying application service, which handles the logic for user creation including the hashing of passwords, establishment of necessary user data structures, and recording of the new user into the database. If successful, the new user is registered, and a confirmation response is sent back to the client. Additional workflows such as sending confirmation or welcome emails may also be initiated at this point.`,
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
