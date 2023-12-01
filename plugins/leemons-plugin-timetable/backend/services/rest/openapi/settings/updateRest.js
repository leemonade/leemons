const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Updates timetable settings',
  description: `This endpoint is responsible for updating the timetable settings for the platform. It allows for adjustments to be made to various configurations related to how timetables are generated, managed, and displayed to the end users.

**Authentication:** Users must be authenticated to modify timetable settings. Without proper authentication, the endpoint will reject the update request.

**Permissions:** Users require specific administrative rights to update timetable settings. Only authorized personnel with the appropriate permission can execute changes to the configuration.

Upon receiving a request, the \`update\` handler in \`settings.rest.js\` calls the \`updateSettings\` action defined in the \`settings\` service. The request data is passed to this action, which then utilizes \`update.js\` in the core \`settings\` module to process the update. The \`update\` method performs validation checks to ensure the data conforms to the required structure and that the user has the necessary permissions to perform the update. If the validation passes, the update action interacts with the persistent storage to apply the changes. The response from this operation is then returned to the client, indicating the success or failure of the update process.`,
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
