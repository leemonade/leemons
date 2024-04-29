const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Configures and retrieves timetable settings',
  description: `This endpoint is responsible for fetching and setting configuration details related to the timetable within the Leemonade platform. It ensures that all the necessary settings for the timetable functionality are correctly managed and updated as per user actions or system requirements.

**Authentication:** Users must be authenticated to interact with the timetable configurations. Access is denied if the user's credentials are not verified.

**Permissions:** This endpoint requires administrator-level permissions. Only users with the 'Manage Timetable Configurations' permission can access or modify the timetable settings.

The function initiates by first verifying user authentication and permissions. It then proceeds to invoke the \`getConfigSettings\` method from the 'Config' core module. This method checks if the current settings exist in the database and retrieves them. If settings need to be updated, it calls the \`updateConfigSettings\` method which handles modifications to the database records based on the input parameters from the request. Finally, the updated or existing configuration settings are returned to the user in a structured JSON format.`,
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
