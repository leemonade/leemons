const { schema } = require('./schemas/response/getProfilesRest');
const { schema: xRequest } = require('./schemas/request/getProfilesRest');

const openapi = {
  summary: 'Fetch user-specific academic profiles',
  description: `This endpoint allows for retrieval of academic profiles associated with the currently authenticated user. It is designed to deliver a customized view of academic progress and achievements.

**Authentication:** Users need to be authenticated to request their academic profiles. Without proper authentication, the endpoint will reject the request and return an error.

**Permissions:** Users must have the appropriate permissions to view academic profiles. The required permission levels vary based on the user's role in the academic institution and the privacy settings of the profiles.

After the authentication and permission checks are satisfied, the \`getProfilesRest\` handler calls the \`getProfiles\` method from the \`settings\` core service. This method processes the request, ensuring that applicable privacy and sharing rules are enforced. It retrieves the academic profiles from the persistent store, typically a database, that correspond to the requesting user's credentials. The method orchestrates the collection of profile data entities, assembling them into a structured response. The culmination of this process is an HTTP response that presents the user with their individual academic profiles in a well-defined JSON format.`,
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
