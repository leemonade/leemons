const { schema } = require('./schemas/response/deleteQuestionBankRest');
const {
  schema: xRequest,
} = require('./schemas/request/deleteQuestionBankRest');

const openapi = {
  summary: 'Deletes a specified question bank',
  description: `This endpoint allows for the deletion of a specific question bank identified by its unique ID. The action ensures that only authorized users can delete a question bank, preserving the integrity and security of the data.

**Authentication:** User authentication is required to access this endpoint. Users must supply valid credentials to proceed with the deletion operation.

**Permissions:** Appropriate permissions are required to delete a question bank. Typically, users need to have administrative rights or specific role-based permissions to perform deletions on question banks.

The controller initiates the deletion process by verifying the user’s authentication and permissions. If the checks pass, it proceeds to call the \`deleteQuestionBank\` method, passing the unique ID of the question bank as an argument. This method interacts with the database to remove the corresponding entry. Upon successful deletion, the response confirms the removal of the question bank, providing feedback to the requester about the outcome of the operation.`,
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
