const { schema } = require('./schemas/response/deleteRest');
const { schema: xRequest } = require('./schemas/request/deleteRest');

const openapi = {
  summary: 'Delete timetable configuration',
  description: `This endpoint is responsible for the deletion of a specific timetable configuration from the system. It ensures that the selected configuration is removed, along with any dependencies, such as associated breaks and class schedules.

**Authentication:** Users must be authenticated to perform this operation. Authentication ensures that the request is made by a legitimate user who has sufficient privileges to delete timetable configurations.

**Permissions:** This action requires the user to have administrative privileges or specific permission to delete timetable configurations. Without the appropriate permissions, the request will be denied.

On receiving a delete request, the handler first verifies the user's authentication and checks their permissions. It then calls the \`deleteConfig\` method from the \`Config\` core service to remove the specified timetable configuration. If there are breaks associated with this configuration, it additionally invokes the \`deleteBreaks\` method from the \`ConfigBreaks\` service. The operation must ensure referential integrity is maintained and any cascading effects of the delete are taken into account. Once the deletion process is complete, the endpoint returns an appropriate success or error response indicating the result of the operation.`,
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
