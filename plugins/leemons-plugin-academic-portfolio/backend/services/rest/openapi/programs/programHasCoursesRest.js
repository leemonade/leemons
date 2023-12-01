const { schema } = require('./schemas/response/programHasCoursesRest');
const { schema: xRequest } = require('./schemas/request/programHasCoursesRest');

const openapi = {
  summary: 'Checks if a program contains any courses',
  description: `This endpoint determines whether a specified academic program has associated courses. It is useful for client applications to verify program content before operations such as enrollment or reporting.

**Authentication:** Users need to be authenticated to query the association of courses with programs. Without authentication, the request will be denied.

**Permissions:** Users must have the permission to view academic program details to utilize this endpoint. Any attempt to access this endpoint without proper permissions will result in an access violation error.

Upon receiving a request, this handler calls the \`programHasCourses\` method from the \`programs\` core module. This method takes the program identifier from the request and queries the academic program database to check for linked courses. It conducts a series of validations to ensure that the program ID is valid and that the requesting user has the necessary permissions. If these checks pass, it proceeds to retrieve a list of courses associated with the program. The endpoint then responds with a boolean indicating the presence or absence of courses within the program.`,
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
