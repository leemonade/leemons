const { schema } = require('./schemas/response/programCoursesRest');
const { schema: xRequest } = require('./schemas/request/programCoursesRest');

const openapi = {
  summary: 'List program courses',
  description: `This endpoint lists all the courses associated with a specific academic program. It is designed to provide educators and students with a complete view of the courses that are part of the program's curriculum.

**Authentication:** Users must be authenticated to request the list of courses for a program. Unauthorized access will lead to the rejection of the request.

**Permissions:** Users need to have the appropriate permission level to access the program's courses list. This typically includes permission to view academic program details within the platform.

Upon receiving a request, this endpoint handles it by first validating the user's credentials and checking their permissions to access academic program information. Once authorized, it then calls the \`getProgramCourses\` function from the \`programs\` core module. This function queries the database to retrieve a list of all courses tied to the specified program. The process involves joining various data tables to compile a comprehensive list that includes course names, descriptions, credits, and other relevant metadata. Upon successful retrieval, the endpoint responds with a structured JSON object containing an array of courses offered within the program, allowing clients to display the information in a user-friendly format.`,
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
