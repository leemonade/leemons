const { schema } = require('./schemas/response/listQuestionBanksRest');
const { schema: xRequest } = require('./schemas/request/listQuestionBanksRest');

const openapi = {
  summary: 'Lists all question banks available to the user',
  description: `This endpoint fetches a collection of question banks that the user has permission to access. It provides a way for users to browse and manage various question banks created for assessments.

**Authentication:** Users must be authenticated to retrieve the list of question banks. An access attempt with invalid or missing credentials will be denied.

**Permissions:** The user needs to have the 'view_question_banks' permission to access this endpoint. Without the required permission, access to the list of question banks will be denied.

Upon request, the 'listQuestionBanks' action is initiated. It starts by verifying the user's authentication and permissions. Assuming the user has the proper privileges, the action then calls the 'listQuestionsBanks' method from the 'questions-banks' core module. This method queries the database to retrieve all question banks that the authenticated user is authorized to view. The results are filtered and formatted as necessary before being sent back to the user in a structured JSON format, containing detailed information about each question bank.`,
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
