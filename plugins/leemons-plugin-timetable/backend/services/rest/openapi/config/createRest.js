const { schema } = require('./schemas/response/createRest');
const { schema: xRequest } = require('./schemas/request/createRest');

const openapi = {
  summary: 'Configure timetable settings',
  description: `This endpoint is responsible for configuring and saving the timetable settings based on the provided details. It typically handles operations such as defining the time slots, setting up break times, and other related configurations for efficient timetable management within the system.

**Authentication:** Users need to be authenticated to interact with the timetable settings. Access to this endpoint requires a valid user session or a specific authentication token to ensure security.

**Permissions:** Users must have 'admin' or 'timetable_manager' roles to modify the timetable settings. The system checks these permissions to ensure that only authorized personnel can make changes to the configurations.

Upon receiving a request, the handler first validates the user’s credentials and permissions. If the validation passes, it proceeds to parse the input data, ensuring all required fields are present and correctly formatted. The handler then interacts with various services such as the 'createConfig' in the 'config' module, where it manages the actual configuration logic such as creating or updating timetable settings. After successful configuration, a confirmation message or the updated settings object is sent back to the client as a response. This process involves detailed error handling to manage any exceptions or errors that might occur during the configuration process.`,
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
