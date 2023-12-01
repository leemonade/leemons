const { schema } = require('./schemas/response/listWithMenuItemRest');
const { schema: xRequest } = require('./schemas/request/listWithMenuItemRest');

const openapi = {
  summary: 'Lists categories with associated menu items',
  description: `This endpoint fetches a list of categories along with their associated menu items, providing a structured view suitable for display in navigation elements or menus within the application.

**Authentication:** Users must be authenticated to request the list of categories and their menu items. Unauthenticated users will not be able to access this data.

**Permissions:** Access to this endpoint requires specific permissions that define whether a user can view the categories and related menu items. Users without the necessary permissions will be denied access.

Upon receiving a request, the handler \`listWithMenuItemRest\` initiates the data retrieval process by calling the \`listWithMenuItem\` action. This action acts as an aggregator that calls the \`listWithMenuItem\` method from the \`categories\` core, which in turn invokes the \`listWithMenuItem\` function. The \`listWithMenuItem\` function conducts a database query to fetch the categories and their linked menu items. It structures the data to provide a clear relationship between categories and their respective items, which is essential for creating user-friendly navigation menus. The final response, containing an array of categories and their menu items, is sent back to the client in JSON format.`,
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
