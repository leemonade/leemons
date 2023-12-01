const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Fetches timetable configuration settings',
  description: `This endpoint retrieves the current configuration settings for the timetable plugin. These settings dictate how timetables are structured and displayed within the system, including preferences on time slots, display formats, and other related configurations.

**Authentication:** Access to this endpoint requires the user to be authenticated. Without proper authentication, the request will be rejected.

**Permissions:** The user must have specific permissions that allow them to view and manage timetable configurations. Without the required permissions, access to the configuration settings is not granted.

Upon receiving a request, the handler initiates a series of method invocations to gather the necessary configuration data. The flow starts with the \`getRest\` action in the \`config.rest.js\` service, which serves as the entry point. It calls upon \`get.js\` from the core \`config\` module, which is responsible for retrieving the basic configuration settings. For additional details, such as break schedules or special calendar entries, \`breakes/get.js\` is utilized as well. To ensure the data is returned in the correct format, \`entitiesFormat.js\` from the \`helpers/config\` directory may also play a role in formatting the output. The result is a comprehensive snapshot of the timetable configurations, formatted appropriately and sent back to the client as a JSON payload.`,
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
