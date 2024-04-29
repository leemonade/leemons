const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List all assets based on user permissions',
  description: `This endpoint lists all assets accessible to the currently authenticated user based on their permissions. The returned assets may include those owned by the user, shared directly with the user, or shared within teams or groups the user belongs to.

**Authentication:** Users must be authenticated to view the list of accessible assets. Proper authentication ensures that the returned list reflects accurate asset access as per user credentials and roles.

**Permissions:** Users need to have the 'view' permission for assets. The system conducts a permission check to ensure the user has rights to access each asset listed. Absence of adequate permissions will limit the visibility of certain assets in the response.

Upon receiving a request, the handler initializes by validating the user’s authentication status. Once authenticated, it proceeds to fetch asset data by invoking related methods like \`filterAssetsByUserPermissions\` which determine the assets that the user is eligible to view. The methodology involves querying the database using criteria based on the user's roles and applicable permissions. Post query execution, the endpoint aggregates the data and formats it into a structured response. Finally, the service returns the list of assets in a JSON formatted payload, providing a clear view of all accessible resources to the user.`,
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
