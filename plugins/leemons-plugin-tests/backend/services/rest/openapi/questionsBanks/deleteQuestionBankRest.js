const { schema } = require('./schemas/response/deleteQuestionBankRest');
const {
  schema: xRequest,
} = require('./schemas/request/deleteQuestionBankRest');

const openapi = {
  summary: 'Deletes a specific question bank',
  description: `This endpoint allows for the deletion of a question bank identified by a unique identifier. Once deleted, all associated questions within the bank are also removed. It's intended for clearing out unwanted or obsolete question banks from the system.

**Authentication:** Users must be authenticated to perform this action. Non-authenticated requests will be rejected with an appropriate error message.

**Permissions:** Users require specific permissions to delete a question bank. Without the requisite permissions, the system will deny the deletion request and return an error.

Upon receiving the delete request, the handler initiates a process to safely remove the question bank from the database. It verifies user permissions and inspects the provided question bank identifier. If the user has sufficient permissions and the identifier corresponds to an existing question bank, the \`removeQuestionBank\` method is executed. This method ensures that all related data is also cleaned up to maintain database integrity. The flow concludes with either a confirmation of deletion or an error message detailing why the deletion could not be processed, encoded as a JSON response.`,
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
