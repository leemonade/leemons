const { schema } = require('./schemas/response/removeGradeTagRest');
const { schema: xRequest } = require('./schemas/request/removeGradeTagRest');

const openapi = {
  summary: 'Remove a specified grade tag',
  description: `This endpoint allows for the deletion of a grade tag from the system. Through this process, a grade tag that may have been created in error or is no longer needed can be efficiently removed from all relevant records and entities.

**Authentication:** Users need to be authenticated to initiate the removal of a grade tag. Unauthorized attempts to access this endpoint will be rejected.

**Permissions:** Users require specific permissions to delete a grade tag. Without the correct permission set, the request to remove a grade tag will be denied, ensuring that only authorized personnel can modify grading structures.

Upon receiving a request to delete a grade tag, the handler begins by verifying the user's authentication status and checking for the necessary permissions to perform the action. Once authenticated with the appropriate permissions, the handler calls the \`removeGradeTag\` function from the \`grade-tags\` core module. This function is responsible for locating the specified grade tag within the database and removing it. It ensures that all references to the grade tag are properly cleared to maintain data integrity. After the grade tag is successfully removed, a response is generated to confirm the deletion to the user performing the request.`,
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
