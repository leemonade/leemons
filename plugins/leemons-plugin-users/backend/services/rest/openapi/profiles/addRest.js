const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Adds a new user profile',
  description: `This endpoint is responsible for the creation of a new user profile within the system. It handles the inclusion of user details and preferences as per the provided data in the request. The profile creation process is subject to the predefined schema and validation rules.

**Authentication:** Users must be logged in to create a new profile. The request is authenticated through active user session tokens to ensure that only recognized users can perform this action.

**Permissions:** The user must have the necessary role-based permissions to create a profile. Typically, this requires administrative privileges or a specific 'create profile' permission assigned to the user's role within the system.

Upon receiving the request, the handler first authenticates the user and checks for proper permissions. Then, it proceeds to call the \`add\` method from the \`profiles\` core module, which encapsulates the business logic for the profile creation, including input validation and persistence to the database. The \`add\` method may interact with other services and modules, such as \`profiles.existName\` to check for unique names and \`profiles.createNecessaryRolesForProfilesAccordingToCenters\` to establish role bindings in different center contexts. On successful execution, the endpoint responds with the new profile details, and in cases of failure, it responds with appropriate error messages.`,
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
