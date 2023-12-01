const { schema } = require('./schemas/response/activeUserAgentRest');
const { schema: xRequest } = require('./schemas/request/activeUserAgentRest');

const openapi = {
  summary: 'Activate a specific user agent',
  description: `This endpoint is responsible for setting the status of a specified user agent to active within the system. It ensures that the user agent can interact with the platform's features and services designated as 'active'.

**Authentication:** Users must be authenticated to invoke this action. The system will reject requests from unauthenticated users, requiring a valid session or authentication token.

**Permissions:** Authorization checks are performed to ensure that the requesting user has the necessary permissions to activate a user agent. The required permission will typically align with administrative roles or a specific privilege set associated with user management.

Upon receiving a request, the 'activeUserAgentRest' handler calls the adjacent service method 'activeUserAgent' with parameters that include the user agent's identification details. The service method interacts with the user agents' core functionality, which executes the necessary logic to verify permission and update the user agent's status. This involves operations such as database calls to update a user agent record's active state and potentially logging the state change. Once the activation process is successfully completed, the endpoint responds with a confirmation of the activation, including any relevant details of the now-active user agent.`,
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
