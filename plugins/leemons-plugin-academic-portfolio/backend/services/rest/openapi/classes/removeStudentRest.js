const { schema } = require('./schemas/response/removeStudentRest');
const { schema: xRequest } = require('./schemas/request/removeStudentRest');

const openapi = {
  summary: 'Removes a student from a class',
  description: `This endpoint is responsible for removing a specific student from a class in the academic portfolio module. The removal process involves deleting the student's association with the class, effectively withdrawing the student from the enrolled class list.

**Authentication:** The user must be authenticated to perform this action. Only authenticated users with the necessary removal privileges can initiate the deletion of a student from a class.

**Permissions:** Specific permission checks are implemented to ensure that only authorized users, such as administrative staff or instructors with the appropriate rights, can remove students from classes. This ensures control over class enrollment and student management is maintained securely.

Upon receiving the removal request, the controller initiates the \`removeStudent\` method, which processes the input parameters identifying the student and the class. It then carries out the necessary validation and checks to ensure the operation is permitted. This involves verifying user authentication, checking if the user has the requisite permissions, and confirming the existence of the student in the specified class. If all checks pass, the method proceeds to remove the student from the class. Finally, the controller returns an appropriate HTTP response indicating the success or failure of the operation, along with any pertinent messages or data.`,
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
