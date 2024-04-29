const { schema } = require('./schemas/response/postCourseRest');
const { schema: xRequest } = require('./schemas/request/postCourseRest');

const openapi = {
  summary: 'Create a new course in the academic portfolio',
  description: `This endpoint allows for the creation of a new course within the academic portfolio system. It handles the course data submission and integrates it into the educational institution's curriculum system, ensuring the new course is registered correctly and available for student enrollment.

**Authentication:** User authentication is mandatory to ensure security and proper access control. Only authenticated users can submit new courses to the system.

**Permissions:** This endpoint requires the user to have 'course_creation' permission within their role. A user without sufficient permissions will be denied access to perform this operation.

The process begins when the endpoint receives a POST request containing the course details. The endpoint first verifies the user's authentication and authorization, ensuring they have the proper rights to create a course. Once verified, it invokes the \`addCourse\` method of the \`CourseService\`. This method takes care of validating the course data against the business rules and saves the course into the database. On successful creation, a confirmation is sent back to the user along with the details of the newly created course, such as its ID and name, in a structured JSON response. Error handling is meticulously integrated to manage any exceptions or validation failures, sending appropriate error messages to the user.`,
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
