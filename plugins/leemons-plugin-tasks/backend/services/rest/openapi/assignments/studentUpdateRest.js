const { schema } = require('./schemas/response/studentUpdateRest');
const { schema: xRequest } = require('./schemas/request/studentUpdateRest');

const openapi = {
  summary: 'Updates assignment details for a student',
  description: `This endpoint updates the information of a specific assignment for an individual student. This operation may involve changes to assignment status, due dates, or any other student-specific details associated with the assignment.

**Authentication:** User authentication is required to ensure only authorized users can modify assignment information. A valid user session is necessary, and an expired or invalid session will prevent access to this endpoint.

**Permissions:** Appropriate permissions must be granted to the user to update assignments for students. Users without the necessary permissions attempting to access this endpoint will receive an error message indicating insufficient permissions.

Upon receiving a request, the endpoint invokes the \`updateStudent\` method from the \`assignments\` core. This method takes in parameters specific to the assignment and student that are passed along through the request's body or query parameters. It performs the necessary validation checks before proceeding with the update, ensuring that the requestor has the appropriate rights to make changes. After the update operation is successful, a confirmation of the update along with the new details of the assignment is returned to the requestor in the form of a JSON object.`,
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
