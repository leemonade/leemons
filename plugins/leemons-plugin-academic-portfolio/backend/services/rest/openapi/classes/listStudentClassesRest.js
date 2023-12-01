const { schema } = require('./schemas/response/listStudentClassesRest');
const {
  schema: xRequest,
} = require('./schemas/request/listStudentClassesRest');

const openapi = {
  summary: 'Lists the academic classes associated with a student',
  description: `This endpoint fetches the academic class details that are associated with the requesting student. It compiles a list of classes that the student is enrolled in, based on their academic profile and current enrollment status.

**Authentication:** User authentication is required to ensure that the student accessing the endpoint is the one associated with the requested class list. Unauthorized access is prevented to protect student privacy and data integrity.

**Permissions:** The user must have student-level permissions to access their own class information. Access to class lists of other students is not permitted unless additional permissions that allow such access are granted to the requesting user.

Upon receiving a request, the \`listStudentClassesRest\` handler initially validates the user's authentication status and permissions. If validation is successful, it proceeds to invoke the \`listStudentClasses\` method from the \`Classes\` core. This method interacts with the database to retrieve the student's current class enrollments, including course information such as class names, schedules, and instructors. The collected data is then formatted appropriately and sent back to the requesting student in a structured response, commonly in JSON format, containing the relevant details of each enrolled class.`,
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
