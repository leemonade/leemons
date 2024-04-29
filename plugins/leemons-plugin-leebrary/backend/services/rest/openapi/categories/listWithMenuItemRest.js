const { schema } = require('./schemas/response/listWithMenuItemRest');
const { schema: xRequest } = require('./schemas/request/listWithMenuItemRest');

const openapi = {
  summary: 'Lists categories with associated menu items',
  description: `This endpoint fetches all categories along with their associated menu items, tailored specifically for display in user interfaces. The data includes the category details and any menu items linked to each category, providing a comprehensive view suitable for navigation or content organization within the platform.

**Authentication:** User authentication is required to access this endpoint. Only authenticated sessions will receive data; otherwise, a request will lead to an access denied response.

**Permissions:** The user needs specific permissions to view categories and their related menu items. These permissions ensure users can only access data that is appropriate to their permission level.

The handler for this endpoint initiates by calling the \`listWithMenuItem\` function from the \`categories\` core. This function constructs a query to the database to retrieve all categories and their corresponding menu items, based on the current user’s access privileges determined through their session credentials. The method aggregates the data and formats it for optimal client-side use, then returns this formatted list as a JSON object. This complete chain from request reception to response delivery ensures that users receive data that is both accurate and specific to their allowed access.`,
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
