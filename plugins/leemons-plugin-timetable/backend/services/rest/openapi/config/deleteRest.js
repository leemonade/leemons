const { schema } = require('./schemas/response/deleteRest');
const { schema: xRequest } = require('./schemas/request/deleteRest');

const openapi = {
  summary: 'Delete timetable configuration data',
  description: `This endpoint allows for the deletion of specific timetable configuration data. It is typically used to remove obsolete or erroneous configuration entries that are no longer required in the system.

**Authentication:** User authentication is mandatory to ensure that only authorized personnel can delete configuration data. An invalid or missing authentication token will result in access being denied.

**Permissions:** The user must have administrative permissions specifically for timetable configurations management. Without sufficient permissions, the request will be rejected.

The deletion process begins with the 'deleteRest' action which interfaces with the corresponding service method in the backend. This method performs a lookup to ensure that the configuration to be deleted exists and that the requesting user has the necessary permissions to proceed with the deletion. If these conditions are met, the configuration data is removed from the database. The flow involves error handling to manage any issues that might arise during the deletion process, such as missing data or database errors. On successful deletion, a confirmation response is sent back to the user, indicating that the data was successfully removed.`,
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
