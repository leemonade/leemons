const { schema } = require('./schemas/response/searchUsersRest');
const { schema: xRequest } = require('./schemas/request/searchUsersRest');

const openapi = {
  summary: 'Search for users within the system',
  description: `This endpoint performs a search for users based on a set of criteria provided in the request. It is designed to retrieve a list of users that match the search terms, facilitating the management of user accounts and information within the platform.

**Authentication:** Users need to be authenticated to perform a search. The system will validate the provided credentials and only proceed with the search if authentication is successful.

**Permissions:** Access to this endpoint requires the user to have specific search permissions. The level of detail in search results may vary based on the user's permissions, ensuring they only obtain information they are authorized to view.

Upon receiving a search request, the \`searchUsersRest\` handler initiates by parsing the incoming search parameters. The handler then calls a dedicated search service, typically asynchronous, which interacts with the user management subsystem. The search service uses these parameters to filter through the user database and gather a list of user profiles that meet the search criteria. Once the results are obtained, the handler formats these appropriately and returns them as a JSON response, along with relevant metadata such as total result count and pagination details if applicable.`,
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
