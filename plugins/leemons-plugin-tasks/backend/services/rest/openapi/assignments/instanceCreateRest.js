const { schema } = require('./schemas/response/instanceCreateRest');
const { schema: xRequest } = require('./schemas/request/instanceCreateRest');

const openapi = {
  summary: 'Creates a new task assignment',
  description: `This endpoint is responsible for creating a new task assignment within the system. It allows users to assign tasks to individuals or groups, setting the details and expectations for the assigned task.

**Authentication:** Only logged-in users can create task assignments. Users need to provide valid session credentials in order to perform this operation.

**Permissions:** Users must have the 'create_assignment' permission to create new task assignments. If a user does not have the necessary permissions, the system will reject the request.

Upon receiving the request, the endpoint validates the user's authentication and permissions. If validation succeeds, it proceeds to invoke the \`createAssignment\` method, which handles the construction of a new assignment object. This includes setting the assignee, the task details, and any deadlines or requirements. The method interacts with the database to store the new assignment. If the operation is successful, the new assignment details are returned in the response. In case of failure, an appropriate error message is sent back to the client, indicating the cause of the error.`,
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
