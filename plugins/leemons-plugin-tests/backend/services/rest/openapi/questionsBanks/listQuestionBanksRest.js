const { schema } = require('./schemas/response/listQuestionBanksRest');
const { schema: xRequest } = require('./schemas/request/listQuestionBanksRest');

const openapi = {
  summary: 'Lists all question banks available to the user',
  description: `This endpoint lists all the question banks that the user has access to, providing essential details for each question bank such as name, description, and related subjects. It is primarily used in educational platforms where question banks play a critical role in organizing quizzes and exams.

**Authentication:** Users need to be authenticated to view the list of question banks. Unauthorized access requests will be rejected, requiring valid login credentials for access.

**Permissions:** The user must have the 'view_question_banks' permission to access this endpoint. Additional permissions might be required to view detailed contents of each question bank, depending on the platform's configuration.

This handler initiates by calling the \`listQuestionsBanks\` method from the \`questions-banks\` core module. This method performs a query to retrieve all question banks that the current user is authorized to view based on their roles and permissions. The logic involves checking user permissions, filtering question banks according to these permissions, and finally compiling the data into a structured format. The response is then formatted to JSON and includes a list of question banks along with relevant attributes like bank ID, name, and description.`,
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
