const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Updates timetable settings for a specific user',
  description: `This endpoint is used for updating the timetable settings specific to a user. It allows the updating of settings such as preferences and configurations related to that user's timetable management.

**Authentication:** User authentication is required to ensure that the request is made by a valid, logged-in user. The session or token must be verified prior to processing the request.

**Permissions:** The user must have the 'timetable-settings-update' permission to update timetable settings. This ensures that only authorized users can make changes to their timetable configurations.

Upon receiving the update request, the handler first authenticates the user and checks required permissions. If authentication or authorization fails, it returns an appropriate error response. If successful, it invokes the \`updateSettings\` method in the settings core, passing necessary parameters such as user ID and new settings data. This method performs the update operation in the database and returns a success response indicating that the settings have been updated. Throughout the process, error handling mechanisms are in place to catch and respond to any issues that might occur during the update operation.`,
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
