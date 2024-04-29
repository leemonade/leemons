const { schema } = require('./schemas/response/detailRest');
const { schema: xRequest } = require('./schemas/request/detailRest');

const openapi = {
  summary: 'Provides detailed profile information by URI',
  description: `This endpoint fetches detailed information of a user profile based on the provided URI. It aims to give a comprehensive view of a user's profile including personal details, roles, and any other related data defined within the scope of the endpoint.

**Authentication:** Users need to be authenticated to access profile details. Access is denied if the authentication credentials are invalid or not provided.

**Permissions:** This endpoint requires the user to have specific permissions to view detailed profile information. The required permission typically includes the ability to view user details or specific roles that involve administrative rights over user profiles.

The flow begins by the endpoint receiving a URI parameter that identifies a specific user profile. It then calls the \`detailByUri\` method from the \`profiles\` core module. This method is responsible for querying the database to retrieve all pertinent details associated with the given URI. The data fetched encompasses all comprehensive attributes and associations relevant to the user profile. Once data is successfully retrieved and compiled, it is formatted into a JSON structure and sent as a response to the client, providing all the necessary details about the user profile as specified by the requester's permissions.`,
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
