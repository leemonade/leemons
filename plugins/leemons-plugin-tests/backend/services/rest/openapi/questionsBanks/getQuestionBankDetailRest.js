const { schema } = require('./schemas/response/getQuestionBankDetailRest');
const {
  schema: xRequest,
} = require('./schemas/request/getQuestionBankDetailRest');

const openapi = {
  summary: 'Retrieve detailed information about a specific question bank',
  description: `This endpoint fetches comprehensive details about a particular question bank identified by its unique ID. It provides a deep dive into the question bank's attributes, including associated categories, subjects, and individual questions contained within the bank.

**Authentication:** Users must be authenticated to access the details of a question bank. Access attempts with invalid or missing authentication tokens will be denied.

**Permissions:** The user must have the appropriate permissions to view the question bank details. Generally, this includes permissions like 'view_question_bank' or 'manage_question_bank', depending on the implementation specifics of the security policy in place.

The detailed flow of this controller handler begins with the receipt of the request that includes the question bank ID. The handler invokes the \`getQuestionsBanksDetails\` method from the \`questions-banks\` core module. This method is responsible for querying the database to retrieve all relevant data about the question bank, including meta-data, categories, associated subjects, and questions. Depending on the design, it may also involve additional model handlers to fetch related data from different tables or services. The response is then prepared, encapsulating all the fetched information in a well-structured JSON format, which is returned to the user.`,
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
