const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Fetches task profiles assigned to the current user',
  description: `This endpoint is designed to retrieve task profiles that are assigned to the currently authenticated user within the platform. These task profiles contain specific settings and permissions for the user to interact with assigned tasks.

**Authentication:** User authentication is mandatory to ensure that each user accesses only the task profiles that belong to them or for which they are authorized.

**Permissions:** This endpoint requires the user to have 'view profiles' permission. Without the proper permissions, the user will not be granted access to the requested task profiles.

Upon receiving a request, the \`getRest\` handler invokes the \`getProfiles\` method within the \`profiles\` core. This core method is responsible for querying the underlying database and retrieving all profiles that match the criteria of the current user's session, such as user ID and any roles or groups the user belongs to. The service then formats these profiles into a structured response and sends it back to the user in JSON format, detailing the tasks and permissions associated with each profile.`,
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
