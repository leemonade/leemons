const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'List user permissions',
  description: `This endpoint lists all the permissions associated with a user within the leemons SaaS platform. The permissions returned are those that the user has been granted explicitly or through any roles they have been assigned.

**Authentication:** Users must be authenticated to query for their permissions. The endpoint requires the presence of a valid session or authentication token.

**Permissions:** Users must have the specific 'list_permissions' or equivalent administrative permissions to access this endpoint and retrieve permissions data.

Upon receiving a request, the endpoint triggers the 'listRest' action which subsequently calls the 'list' core method located in 'leemons-plugin-users/backend/core/permissions/list.js'. This method performs a series of actions, such as querying the underlying database to retrieve all permissions tied to the user, processing the data to ensure it fits the expected output format, and resolving any dependency or hierarchical permission structures. Finally, the complete list of permissions, in a structured format, is sent back to the client in the form of a JSON response.`,
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
