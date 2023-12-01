const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Manages instances for assignable items',
  description: `This endpoint is responsible for managing the instances of assignable items within the system, such as assignments, quizzes, or other tasks designed for users to complete. It allows operations like creating, updating, and retrieving instances of these items, as well as tracking their status and progress.

**Authentication:** Access to the endpoint requires the user to be authenticated. Unauthenticated requests will not be processed, and the user will receive an appropriate error response.

**Permissions:** Users require specific permissions to interact with assignable instances. The required permissions depend on the action being performed (e.g., creating, editing, viewing) and the roles of the user within the system. Without the appropriate permissions, the user's request will be rejected.

Upon receiving a request, the handler first validates the user's authentication and authorization. If the user is authenticated and has the necessary permissions, the controller then calls relevant methods within the service to carry out the requested action. For instance, on a request to retrieve an assignable instance, the handler would call a method to fetch the specific instance data from the database. The flow involves error handling to catch any issues and return useful error messages. The final response includes the details of the assignable instance(s), such as identifiers, status, and other relevant metadata, formatted as a JSON object and returned to the user.`,
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
