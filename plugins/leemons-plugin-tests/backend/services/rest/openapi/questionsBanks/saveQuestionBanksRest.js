const { schema } = require('./schemas/response/saveQuestionBanksRest');
const { schema: xRequest } = require('./schemas/request/saveQuestionBanksRest');

const openapi = {
  summary: 'Save a new question bank',
  description: `This endpoint is responsible for creating and saving a new question bank using information provided by the user. It handles the processing of question bank data and ensures that it is stored correctly within the system's database.

**Authentication:** Users must be authenticated to create and save a new question bank. The action is protected and an invalid or expired authentication token will result in a denial of access to use this endpoint.

**Permissions:** Users need to have the proper permissions to create question banks. These permissions determine whether the user can perform this action, and lacking the requisite permissions will result in an error and prevention of question bank creation.

Upon receiving a request, the handler starts by validating the provided data for the new question bank, ensuring all required fields are present and correctly formatted. Once validation passes, the handler calls an internal method, typically named something like \`createQuestionBank\`, with the sanitized data. This method interacts with the database to insert the new question bank record. On successful insertion, the handler then constructs a response, which includes details of the newly created question bank or any relevant confirmation messages. In case of errors during the process, appropriate error responses are generated and sent back to the client.`,
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
