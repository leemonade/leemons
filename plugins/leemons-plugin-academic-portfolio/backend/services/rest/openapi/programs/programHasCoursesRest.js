const { schema } = require('./schemas/response/programHasCoursesRest');
const { schema: xRequest } = require('./schemas/request/programHasCoursesRest');

const openapi = {
  summary: 'Checks if a program includes certain courses',
  description: `This endpoint determines if a specified academic program includes one or more specific courses. It is typically used to verify program curriculum completeness or to assist in academic planning and advising.

**Authentication:** Users need to be authenticated to access this endpoint. Unauthorized access attempts will be blocked and logged.

**Permissions:** This function requires the user to have 'view_program_courses' permission. Without the necessary permissions, access to the data will be denied, and only a generic error message will be returned to the user.

Upon receiving a request, the handler first authenticates the user and checks for the necessary permissions. If validation fails at any point, the process is terminated, and an appropriate error message is returned. If the checks are successful, the handler invokes the \`getProgramCourses\` method from the \`programs\` core module, passing the program's identification details. This method accesses the database to retrieve a list of courses associated with the specified program; it performs this by querying the program-course relationship data. Once the data is obtained and processed, the handler constructs a response containing information about whether the required courses are part of the program, then sends this response to the requester.`,
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
