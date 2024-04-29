const { schema } = require('./schemas/response/updateCalendarConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/updateCalendarConfigRest');

const openapi = {
  summary: 'Update an existing calendar configuration',
  description: `This endpoint updates a specific calendar configuration by applying provided modifications to aspects such as name, settings, and associated events. The modifications only affect the targeted calendar configuration.

**Authentication:** Users need to authenticate to access and modify the calendar configurations. Updates are rejected if the user's session is unauthenticated or expired.

**Permissions:** Users must have the 'calendar.modify' permission to update calendar configurations. Unauthorized attempts will result in denial of the operation.

The endpoint begins with validation of the request payload against predefined schema rules, ensuring all required modifications are present and correctly formatted. It then proceeds to check user permissions and, if permitted, fetches the specified calendar configuration from the database using the 'findByConfigId' method from the calendar service. After retrieving the configuration, it applies the requested changes and updates the database record. Finally, it sends back an HTTP response to the client indicating the success of the operation, including details of the updated configuration in JSON.`,
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
