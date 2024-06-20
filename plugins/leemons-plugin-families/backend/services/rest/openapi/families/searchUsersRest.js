const { schema } = require('./schemas/response/searchUsersRest');
const { schema: xRequest } = require('./schemas/request/searchUsersRest');

const openapi = {
  summary: 'Search for users within the family members module',
  description: `This endpoint allows searching for user profiles that are part of the family members system within the Leemonade platform. It handles queries to filter and return user data based on specified criteria, facilitating the management and overview of family configurations.

**Authentication:** Users must be authenticated to access and search for family member details. The access is granted only upon successful authentication, ensuring data privacy and security.

**Permissions:** The user must have the 'view_users' permission within their role to perform searches on family member data. This permission check ensures that only authorized personnel can access sensitive user information.

The process begins by invoking the 'searchUsers' method located in the 'families.rest.js', which interacts with the users' core system. The method utilizes the Moleculer query handling to fetch user data based on provided search parameters received from the client-side. After processing the query, the endpoint compiles the results into a structured format and returns this data to the requester in a JSON format, which includes details like user ID, names, and roles within family contexts.`,
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
