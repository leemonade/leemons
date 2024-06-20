const { schema } = require('./schemas/response/programCoursesRest');
const { schema: xRequest } = require('./schemas/request/programCoursesRest');

const openapi = {
  summary: 'Fetch program courses associated with a specific academic program',
  description: `This endpoint retrieves a list of all courses associated with a specified academic program. The result includes detailed information about each course such as titles, credits, and other relevant academic details.

**Authentication:** Users must be authenticated to access the program courses list. An invalid or missing authentication token will result in access denial.

**Permissions:** Users need to have the 'view_program_courses' permission to retrieve the list of courses. Without this permission, access to course information will be restricted.

Upon receiving a request, this endpoint initiates by calling the \`getProgramCourses\` method from the \`programs\` core service. This method takes the program's identification details from the request parameters and queries the database to fetch all courses linked to the specified program. The method processes the data to format it appropriately, ensuring that all relevant academic information is included and well-presented in the response. Finally, the endpoint responds with a structured JSON containing the courses data, facilitating easy consumption and integration on the client side.`,
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
