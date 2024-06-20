const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Updates the timetable configuration settings',
  description: `This endpoint allows for the updating of timetable configuration settings within the system. It is specifically designed to handle adjustments in the configuration parameters that affect how timetables are managed and displayed.

**Authentication:** User authentication is required to access this endpoint. Without proper authentication, the request will be rejected, ensuring that only authorized users can make changes to the timetable configurations.

**Permissions:** This endpoint requires users to have 'admin' or 'timetable_manager' roles. Users with these permissions can update configuration settings, which includes modifying details like timetable intervals, break times, and other related settings.

Upon receiving the request, the \`updateConfig\` method from the \`ConfigService\` is called with necessary payload containing new configuration values. This method validates the payload against predefined schema to ensure data integrity and then proceeds to update the configurations in the database. If the update is successful, a confirmation response is sent back to the client. If there is an error during the process, such as validation failure or database issues, appropriate error messages are returned to ensure the client can react accordingly.`,
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
