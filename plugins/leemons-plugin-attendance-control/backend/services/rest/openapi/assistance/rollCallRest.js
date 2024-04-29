const { schema } = require('./schemas/response/rollCallRest');
const { schema: xRequest } = require('./schemas/request/rollCallRest');

const openapi = {
  summary: 'Manage attendance roll calls',
  description: `This endpoint is designed to handle the management of attendance roll calls for classes or sessions. It facilitates the creation, modification, and viewing of roll call records for participants in educational or professional settings.

**Authentication:** User authentication is mandatory for access. Without valid credentials, users will be prevented from performing any operations related to roll calls.

**Permissions:** Users need specific permissions related to attendance management. Typically, this will include permissions like 'view_attendance', 'edit_attendance', and 'manage_attendance' depending on the level of access required for the operation.

The controller flow begins with the incoming request which is authenticated and authorized to ensure the user has the necessary rights. Following authentication, the endpoint processes the request by calling respective methods such as \`createRollCall\`, \`editRollCall\`, or \`getRollCallDetails\`, depending on the action specified. These methods interact with underlying data storage systems to record or retrieve the necessary attendance information. Detailed error handling is incorporated to manage situations where the request cannot be fulfilled due to invalid inputs or conditions that do not meet business rules. The final response is generated and returned to the user in JSON format, providing either the requested data or an error message detailing any issues encountered.`,
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
