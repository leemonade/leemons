const { schema } = require('./schemas/response/createRest');
const { schema: xRequest } = require('./schemas/request/createRest');

const openapi = {
  summary: 'Creates a new timetable with specified configurations',
  description: `This endpoint is responsible for creating a new timetable based on the provided configurations and time slots. It facilitates the scheduling of classes, meetings, or events within an educational or organizational setting.

**Authentication:** Users must be authenticated to create a new timetable. The endpoint will reject requests from unauthenticated users.

**Permissions:** This endpoint requires the user to have 'timetable_create' permissions. Without the necessary permissions, the request will be denied.

Upon receiving a request, the endpoint first verifies user authentication and permissions. It then proceeds to call the \`create\` function from the \`timetables\` core, which takes the user input and generates a new timetable. This process involves validating the input data, processing time and date information using helpers such as \`timeToDayjs\`, \`validateDay\`, and \`getWeekdays\`, and inserting the resulting timetable into the database. The \`count\` method may also be used to verify existing timetables or for post-creation summaries. If successful, the endpoint responds with the newly created timetable's details. In the case of errors during creation, it returns an appropriate error message detailing the failure.`,
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
