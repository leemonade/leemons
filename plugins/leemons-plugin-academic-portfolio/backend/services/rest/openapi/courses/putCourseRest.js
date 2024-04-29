const { schema } = require('./schemas/response/putCourseRest');
const { schema: xRequest } = require('./schemas/request/putCourseRest');

const openapi = {
  summary: 'Update existing course details',
  description: `This endpoint updates the details of an existing course in the academic portfolio database. It allows for modifications of name, description, credits, and other course-related attributes that are essential for managing the academic offerings within the platform.

**Authentication:** Users must be authenticated and have a valid session token to make updates to course details. Attempts to access this endpoint without authentication will result in a '401 Unauthorized' response.

**Permissions:** This endpoint requires the user to have 'edit_course' permission. Users without this permission will receive a '403 Forbidden' error, indicating that they do not have enough rights to perform this operation.

Upon receiving a request, the \`putCourseRest\` handler begins by validating the incoming data against the \`courseSchema\` using the \`forms.js\` validator. If validation fails, it responds with a '400 Bad Request' containing validation error details. If successful, it proceeds to invoke the \`updateCourse\` method from the \`courses\` core with the validated data. This method is responsible for applying the updates in the database. The final response reflects the outcome of the update operation, typically returning the updated course object or an error message if the update could not be performed.`,
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
