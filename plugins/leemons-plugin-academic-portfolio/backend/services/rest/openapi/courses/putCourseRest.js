const { schema } = require('./schemas/response/putCourseRest');
const { schema: xRequest } = require('./schemas/request/putCourseRest');

const openapi = {
  summary: 'Update course details',
  description: `This endpoint allows for updating the existing course information with new details provided in the request. It is typically used to modify course attributes such as the title, description, or other metadata associated with the course.

**Authentication:** Users must be authenticated to update course details. The endpoint requires a valid authorization token, and failing to provide one will result in access being denied.

**Permissions:** The user must have the necessary permissions to edit course information. Typically, this includes roles such as academic administrators or instructors who have control over the course content and structure.

Upon receiving the request, the handler first validates the input using predefined validation rules to ensure all required information is present and correctly formatted. If validation passes, it invokes the \`updateCourse\` method within the \`courses\` core module. This method handles the persistence of the updated course data to the database and ensures data integrity. Next, any additional business logic related to the course update is executed, such as notifying students or updating related systems. Finally, the endpoint responds with a success message and the updated course data, or with an appropriate error message if the update cannot be completed.`,
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
