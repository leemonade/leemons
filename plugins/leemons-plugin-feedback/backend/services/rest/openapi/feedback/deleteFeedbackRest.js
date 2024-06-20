const { schema } = require('./schemas/response/deleteFeedbackRest');
const { schema: xRequest } = require('./schemas/request/deleteFeedbackRest');

const openapi = {
  summary: 'Deletes specific feedback based on ID',
  description: `This endpoint facilitates the deletion of a user's feedback from the database. It typically involves the identification and removal of feedback based on the specified ID provided in the request.

**Authentication:** User authentication is necessary to identify and validate the user's permission to delete feedback. The system must ensure that the stateful session or token provided is valid and active.

**Permissions:** Appropriate permissions must be checked to ensure that the user possesses the required rights to delete feedback. This generally includes permissions like 'feedback.delete' or 'admin' role requirements.

Upon receiving the request, the endpoint first verifies the user's authentication status and permissions. If these checks pass, it proceeds to invoke the \`deleteFeedback\` function from the 'feedback' core. This function handles the actual deletion logic, such as locating the specific feedback record by ID in the database and removing it. The successful execution of this function leads to the removal of the feedback, and the endpoint returns a confirmation message, indicating that the operation was successful. Errors during the process, like invalid IDs or insufficient permissions, cause it to return an appropriate error message along with an error status code.`,
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
