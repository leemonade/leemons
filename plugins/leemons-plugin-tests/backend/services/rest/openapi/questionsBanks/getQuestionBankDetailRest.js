const { schema } = require('./schemas/response/getQuestionBankDetailRest');
const {
  schema: xRequest,
} = require('./schemas/request/getQuestionBankDetailRest');

const openapi = {
  summary: 'Fetch details of a specific question bank',
  description: `This endpoint fetches the complete details of a specified question bank, including metadata, associated questions, and any relevant configurations. It is typically used to obtain information needed to edit or review a question bank in detail.

**Authentication:** This endpoint requires the user to be authenticated. Request without a valid session or authentication token will not be processed.

**Permissions:** The user must have 'view' permissions for question banks to access the details of the specified question bank. Without the required permissions, the request will be rejected.

Upon receiving a request, this handler executes the 'getQuestionsBanksDetails' method passing in necessary parameters such as the question bank ID. It interacts with the 'questions-banks' service, calling other internal methods or services as needed to gather comprehensive information about the question bank. This includes retrieving questions, categories, and associated subjects tied to the question bank. It then compiles this information into a structured response, which is returned to the client as a JSON object containing the full question bank details.`,
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
