const { schema } = require('./schemas/response/getIfHasPermissionRest');
const {
  schema: xRequest,
} = require('./schemas/request/getIfHasPermissionRest');

const openapi = {
  summary: 'Checks and retrieves menu details based on user permissions',
  description: `This endpoint validates user permissions and retrieves specific menu information if the user has the required access rights. This ensures that menu data is securely distributed among users with valid permissions.

**Authentication:** The user must be authenticated to access this endpoint. It ensures that only recognized users can perform actions or retrieve information.

**Permissions:** The user needs specific permissions related to menu access. Without the necessary permissions, the request will be denied, maintaining strict access control.

Upon receiving a request, the \`getIfHasPermissionRest\` handler in the menu builder plugin first authenticates the user, ensuring that they are logged in and their session is valid. It then checks if the user has the required permissions to view or manage the requested menu. This involves querying a permissions database to verify user rights. If the user has the appropriate permissions, the handler proceeds to retrieve the menu data from the core menu system, leveraging methods defined in '/backend/core/menu/index.js'. The flow involves conditional checks and database interactions to fetch and return the relevant menu information. The final output is formatted and returned as a JSON response containing the menu details, adhering to the requested data structure.`,
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
