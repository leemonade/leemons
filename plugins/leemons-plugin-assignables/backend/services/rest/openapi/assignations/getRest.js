const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Manage assignment processes for users',
  description: `This endpoint is responsible for managing the assignment process of various resources or tasks to users within the platform. It handles the creation, update, and deletion of assignments, as well as querying for assignment information.

**Authentication:** Users are required to authenticate to interact with the assignation process. Only authenticated users will be able to initiate or modify assignment procedures on the platform.

**Permissions:** Specific permissions are mandated to ensure that only users with the appropriate authority are able to manage assignations. The required permissions are verified by the system before any operation is allowed to proceed.

In detail, the controller handles the request by first verifying the user's authentication status and permissions. Once authenticated and authorized, it may call various methods depending on the action specified in the request. For example, creation of a new assignation might involve calling a method like \`createAssignment\` with relevant parameters from the request payload. Likewise, updating an existing assignment would invoke a method like \`updateAssignment\`, and deletion would call \`deleteAssignment\`. For retrieval of assignment information, methods like \`getAssignmentsByUser\` or \`getAssignmentDetails\` can be utilized. Each action flows through a series of validation, business logic, and interaction with underlying data storage services, resulting in an appropriate HTTP response that reflects the outcome of the requested operation.`,
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
