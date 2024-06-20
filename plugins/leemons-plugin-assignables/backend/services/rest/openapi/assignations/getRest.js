const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Manage assignment operations for users',
  description: `This endpoint handles various operations related to user assignments within a platform, potentially including creating, deleting, updating, or retrieving assignments depending on the implemented methods.

**Authentication:** Users need to be authenticated to perform operations on assignments. Access is restricted based on user authentication status, and attempts to access the endpoint without proper authentication will result in access being denied.

**Permissions:** Specific permissions related to assignment management must be granted to the user. These permissions determine the types of operations the user can perform on assignments (like create, delete, update, retrieve).

Upon receiving a request, the endpoint first verifies user authentication and permissions. If authentication or permissions checks fail, it returns an error response. If checks are successful, it proceeds to call the specific method associated with the action (create, delete, update, retrieve) on the assignments. This involves interfacing with database services to fetch or modify assignment data accordingly. Finally, the request results are formatted and returned to the user in JSON format, reflecting the outcome of their requested operation.`,
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
