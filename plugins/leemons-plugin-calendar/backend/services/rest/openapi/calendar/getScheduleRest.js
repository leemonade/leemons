const { schema } = require('./schemas/response/getScheduleRest');
const { schema: xRequest } = require('./schemas/request/getScheduleRest');

const openapi = {
  summary: 'Generates a schedule view suitable for the frontend',
  description: `This endpoint is designed to generate a user-specific schedule view that can be easily rendered on the frontend. The schedule includes events and appointments specific to the user, formatted to integrate seamlessly with the frontend calendar components.

**Authentication:** User authentication is mandatory to ensure the schedule is personalized and secure. Only authenticated users can request their schedule view.

**Permissions:** Users need to have the 'view_schedule' permission to retrieve their schedule. Without this permission, the endpoint will deny access.

Upon receiving a request, the \`getScheduleRest\` action calls the \`calendar.getSchedules\` method from the calendar core. This method is responsible for querying the database and assembling a user-specific schedule based on the user's identifier and other relevant parameters. The data is then processed by the \`getScheduleToFrontend\` function, which formats the events and appointments into a structure that is compatible with the frontend application. Finally, the processed schedule is returned in the response, providing the frontend with the necessary information to display the user's schedule.`,
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
