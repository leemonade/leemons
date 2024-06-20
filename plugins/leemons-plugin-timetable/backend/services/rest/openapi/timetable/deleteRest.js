const { schema } = require('./schemas/response/deleteRest');
const { schema: xRequest } = require('./schemas/request/deleteRest');

const openapi = {
  summary: 'Delete a specific timetable',
  description: `This endpoint handles the deletion of a specific timetable based on the provided identifier. It ensures that the data deletion is managed cleanly without leaving orphaned data or references.

**Authentication:** Users must be authenticated to delete timetables. The system checks for a valid session or authentication token before processing the request.

**Permissions:** This endpoint requires the user to have administrative rights or specific permissions tailored to modifying or deleting timetable data. Without the necessary permissions, the request will be denied.

Upon receiving a request, the endpoint first validates the presence and correctness of the timetable ID. It then calls the \`deleteTimetable\` function from the timetables core logic. This function checks for the existence of the timetable in the database and proceeds with the deletion if it exists and the user has appropriate rights. The deletion process also involves any cleanup necessary to maintain data integrity, such as removing associated time slots or user assignments. After successful deletion, a confirmation message is sent back to the user, indicating the successful removal of the timetable.`,
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
