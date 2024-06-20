const { schema } = require('./schemas/response/studentUpdateRest');
const { schema: xRequest } = require('./schemas/request/studentUpdateRest');

const openapi = {
  summary: 'Updates assignment details for a student',
  description: `This endpoint allows for the updating of specific assignment details for a student, typically involving changes in assignment status or submission details tailored to aid in educational management tasks.

**Authentication:** Users need to be authenticated to update assignment details. This ensures that only registered users can make updates to the assignments.

**Permissions:** Required permissions include edit or update access rights on assignments, which ensures that only authorized personnel or students themselves are able to modify assignment details.

Upon receiving a request, this handler calls the \`updateStudent\` method located in 'leemons-plugin-tasks/backend/core/assignments/updateStudent.js'. The method takes in parameters such as the student ID, assignment details, and perhaps any new submission files or status updates. It then processes these updates in the system's database, ensuring all changes adhere to existing educational or organizational policies. The process involves validating the input data, updating the database records, and handling any exceptions or errors that occur during the update. The final output is a successful confirmation of the update or an error message detailing any issues encountered during the process.`,
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
