const { schema } = require('./schemas/response/getProfilesRest');
const { schema: xRequest } = require('./schemas/request/getProfilesRest');

const openapi = {
  summary: 'Fetch academic profiles based on user access',
  description: `This endpoint fetches academic profiles from the academic portfolio system, tailored according to the access rights and roles of the requesting user. It aims to provide a personalized view of academic credentials, courses, and achievements stored within the system.

**Authentication:** User authentication is mandatory for accessing this endpoint. Access will be denied if authentication credentials are not provided or are invalid.

**Permissions:** The user needs to have 'view_profiles' permission to retrieve academic profiles. Without this permission, the server will return an unauthorized access error.

Upon receiving a request, the \`getProfilesRest\` handler initiates the process by verifying user authentication and permissions. If verification is successful, it calls the \`getProfiles\` method from the \`Settings\` core module. This method queries the database for academic profiles that align with the user's roles and permissions, ensuring that each user only accesses information they are authorized to view. The resulting profiles are then formatted and returned as a JSON response, providing a comprehensive yet secure overview of academic data relevant to the user.`,
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
