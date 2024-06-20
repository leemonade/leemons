const { schema } = require('./schemas/response/listCourseRest');
const { schema: xRequest } = require('./schemas/request/listCourseRest');

const openapi = {
  summary: 'List all courses available in the academic portfolio',
  description: `This endpoint provides a comprehensive list of all courses available within the academic portfolio system. It retrieves details such as course identifier, title, and description that are available for enrollment or review by the user.

**Authentication:** User authentication is required to access the list of courses. The system checks if the requesting user session is valid before proceeding with the request.

**Permissions:** The user must have the 'view_courses' permission to access this data. Without sufficient permissions, the system denies access to the course listings.

The flow of the request starts when the endpoint receives a GET request. It then calls the \`listCourses\` method from within the 'courses' core module. This method queries the underlying database for all available courses, applying any necessary filters such as those pertaining to user permissions or specific department criteria. Once the data is fetched and formatted, it is returned as a JSON array back to the user through the response payload. Each course in the array includes essential information such as the course ID, name, and a brief description.`,
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
