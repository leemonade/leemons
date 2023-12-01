const { schema } = require('./schemas/response/profilesRest');
const { schema: xRequest } = require('./schemas/request/profilesRest');

const openapi = {
  summary: 'Manage user profiles',
  description: `This endpoint is responsible for managing user profiles within the platform. It provides functionality for retrieving, adding, updating, or deleting user profile information based on the given action and parameters.

**Authentication:** A valid user session is required to interact with this endpoint. Unauthenticated users will be unable to access this handler's functionality.

**Permissions:** Proper user permissions are needed to manage profiles. Depending on the action (retrieve, add, update, delete), specific permissions such as \`view_profile\`, \`edit_profile\`, \`add_profile\`, or \`delete_profile\` may be checked against the user's role.

Upon receiving a request, the handler first checks for user authentication and permission validation. Once authorized, it proceeds with the requested action. The handler interacts with the \`UserProfileService\` to process the action, which can involve calling different core methods such as \`getProfiles\`, \`addProfile\`, \`updateProfile\`, or \`deleteProfile\`. These methods operate on the user profiles datastore and handle the business logic, including validation, conflict resolution, and data persistence. The handler ultimately sends back an HTTP response, which varies based on the action taken: for retrieval, a JSON object representing user profiles; for update or add, a confirmation of changes made; for delete, a status of deletion.`,
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
