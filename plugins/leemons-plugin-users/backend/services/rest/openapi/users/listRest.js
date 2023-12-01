const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'Lists all users based on querying criteria',
  description: `This endpoint is designed to list all users that match certain querying criteria defined in the request. It supports filtering, pagination, and sorting to retrieve user information efficiently and effectively.

**Authentication:** Users must be authenticated to call this endpoint. It ensures that only authorized individuals can retrieve user data.

**Permissions:** The user must have the 'list_users' permission to access this information. Without the appropriate permission, the user will not be able to execute this action.

Upon receiving a request, the handler begins by verifying the user's authentication status and permissions. If the user is authenticated and has the necessary permissions, the handler proceeds with the \`list\` action. This involves querying the user database based on the provided criteria, which may include filters for specific user fields, pagination parameters such as page number and limit, and sorting options. The handler then prepares the data accordingly and responds with a list of users, including relevant metadata such as total count and pagination details. Throughout the process, the handler ensures that only data that the requester is authorized to view is included in the response.`,
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
