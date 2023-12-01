const { schema } = require('./schemas/response/listCourseRest');
const { schema: xRequest } = require('./schemas/request/listCourseRest');

const openapi = {
  summary: 'List available courses',
  description: `This endpoint lists all the courses available in the academic portfolio. It provides a comprehensive catalog of the courses that students can enroll in or that educators can manage within the academic institution's system.

**Authentication:** Users need to be authenticated to access the list of courses. An authentication check is performed to ensure that only authorized users can retrieve course information.

**Permissions:** Appropriate permissions are required for users to list courses. The specific permissions depend on the user role, such as administrator, educator, or student, and are checked to ensure that the user has the right to access the course catalog.

Upon receiving a request, the \`listCourseRest\` handler calls the \`listCourses\` method from the \`courses\` core module. This method is responsible for querying the course database and retrieving the relevant course data. It filters the list of courses based on authorization and permissions provided by the user's context. After the query execution and filtering, it compiles the list of courses into a structured response that is returned to the user. The response includes details such as the course ID, name, description, and potentially other metadata associated with each course offering.`,
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
