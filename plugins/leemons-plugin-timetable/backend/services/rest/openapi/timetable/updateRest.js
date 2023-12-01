const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update an existing timetable',
  description: `This endpoint updates a specified timetable with new details as provided in the request. The update may involve changes to the timetable structure, time slots, or associated details.

**Authentication:** Users must be authenticated and have a valid session to request a timetable update. Without proper authentication, the request will not be processed.

**Permissions:** Specific permissions are required for a user to update a timetable. Only users with the 'timetable:update' permission can perform timetable modifications, ensuring that unauthorized users cannot alter timetable data.

On receiving a request, the \`updateRest\` handler validates the input and checks the user's permissions. It then calls the \`update\` method from the \`timetables\` core, providing it with the necessary parameters obtained from the request. Throughout this process, the handler may employ various helper functions such as \`timeToDayjs\`, \`validateDay\`, and \`getWeekdays\` to format and validate date-related data. If the update is successful, the method returns the updated timetable. In case of any errors during the process, appropriate error messages are generated and returned to the user.`,
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
