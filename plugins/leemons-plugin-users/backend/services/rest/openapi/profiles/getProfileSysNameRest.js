const { schema } = require('./schemas/response/getProfileSysNameRest');
const { schema: xRequest } = require('./schemas/request/getProfileSysNameRest');

const openapi = {
  summary: 'Fetch system name of a user profile',
  description: `This endpoint retrieves the system name associated with a specific user profile. The system name is a unique identifier typically used for internal processing and integrations.

**Authentication:** User authentication is required to access this endpoint. Unauthenticated requests are denied and result in an error.

**Permissions:** Users need to have 'read' access rights to the profile data to utilize this endpoint. Without the necessary permissions, the system restricts data retrieval to safeguard user information.

Upon request, the \`getProfileSysNameRest\` action invokes the \`getProfileSysName\` function from the \`profiles\` core module. This function processes the incoming request to determine the appropriate profile based on the user's context and extracts the system name from the profile data. It then returns this system name as a string in the HTTP response. The entire operation ensures that the user's data is accessed securely and only reveals the system name to those with the appropriate permissions.`,
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
