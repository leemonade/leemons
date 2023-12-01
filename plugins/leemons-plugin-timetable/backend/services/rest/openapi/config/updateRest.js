const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update timetable configuration settings',
  description: `This endpoint updates the configuration settings of the timetable for the leemons-plugin-timetable. It is designed to accept a payload containing new configuration parameters which will overwrite the existing settings for the timetable service.

**Authentication:** Users must be logged in and provide a valid authentication token to use this endpoint. The token is used to verify the user's identity and ensure that they have the necessary permissions to update the configuration.

**Permissions:** To successfully call this endpoint, the user must have the 'timetable.config.update' permission. Without this permission, the system will deny access to the update functionality.

Upon receiving a request, the \`updateRest\` action in the \`config.rest.js\` triggers a workflow that begins with validating the provided input against a predefined schema. Assuming validation passes, it then calls the \`update\` method within the \`update.js\` service. This method is responsible for updating the database entries with the new configuration settings. If the update is successful, the controller responds with the updated configuration object. In the case of an error during any part of this process, the user is informed with an error message detailing the failure.`,
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
