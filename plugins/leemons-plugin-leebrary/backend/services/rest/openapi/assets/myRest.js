const { schema } = require('./schemas/response/myRest');
const { schema: xRequest } = require('./schemas/request/myRest');

const openapi = {
  summary: 'Retrieve assets owned by the current user',
  description: `This endpoint retrieves all digital assets that are owned by the currently authenticated user. The collection of assets returned includes those that the user has created or have been shared with them within the platform.

**Authentication:** Users must be authenticated to access their digital assets. An invalid or missing authentication token will result in endpoint access denial.

**Permissions:** The required permissions for this endpoint are specific to the assets that the user is attempting to access. Users can only see and interact with assets for which they have appropriate view or edit permissions, enforced by internal access control checks.

Upon receiving the request, the handler begins by validating the user's authentication token to ensure the request is made by a genuine, authorized user. Once authentication is confirmed, the \`getByUser\` method in the corresponding \`Pins\` service is called. This method is responsible for querying the database to retrieve all assets associated with the user's account, including assets that have been pinned or marked as favorites by the user. The assets are then formatted, if necessary, to match the expected response structure. Finally, the handler responds to the client's request with a JSON payload containing the list of digital assets the user has rights to access, along with relevant metadata for each asset.`,
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
