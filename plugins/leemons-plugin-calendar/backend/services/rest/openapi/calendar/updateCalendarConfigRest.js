const { schema } = require('./schemas/response/updateCalendarConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/updateCalendarConfigRest');

const openapi = {
  summary: 'Update calendar configuration details',
  description: `This endpoint is responsible for updating the details of a specific calendar configuration. The process involves modifying various attributes of a calendar such as its name, active state, or associated metadata, to reflect the latest information as per the user's request.

**Authentication:** User authentication is mandatory to ensure that only authorized users can modify calendar configurations. An unauthenticated request will be rejected.

**Permissions:** Users need to have 'calendar.config.update' permission to update a calendar configuration. Without the necessary permissions, the endpoint will deny access.

Upon receiving a request, the endpoint first validates the input data against predefined schemas to ensure it complies with the expected structure and types. If validation passes, the \`update\` method within the \`calendar-configs\` service is called. This method executes the logic to apply the requested changes to the calendar configuration stored in the system's persistent storage, such as a database. In the event of a successful update, the endpoint responds with the updated calendar configuration object. If the update operation fails, the endpoint handles the error and provides a relevant message in the response.`,
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
