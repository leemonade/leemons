const { schema } = require('./schemas/response/detailRest');
const { schema: xRequest } = require('./schemas/request/detailRest');

const openapi = {
  summary: 'Fetch a detailed user profile based on a unique identifier',
  description: `This endpoint retrieves a full profile for a specific user, identified by a unique URI. The profile includes all relevant details personal and system-related information about the user.

**Authentication:** User authentication is required to ensure secure access to the profile details. An authenticated session or a valid token must be presented to access this endpoint.

**Permissions:** A user must have the 'view_profile' permission for the profile they are attempting to access. Without the necessary permissions, the request will be denied to protect user privacy.

Upon receiving a request, the handler begins by invoking the \`detailByUri\` function from the 'profiles' core. This function is responsible for looking up the user profile based on the provided URI. It checks if the requester has the required permissions to access this profile. If the authentication and authorization checks pass, the profile data is retrieved, potentially involving the \`transformArrayToObject\` helper to properly format the profile data. Finally, the detailed profile is returned to the requester in a JSON format, containing all the information associated with the user’s account.`,
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
