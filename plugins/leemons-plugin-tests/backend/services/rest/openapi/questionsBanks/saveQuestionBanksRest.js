const { schema } = require('./schemas/response/saveQuestionBanksRest');
const { schema: xRequest } = require('./schemas/request/saveQuestionBanksRest');

const openapi = {
  summary: 'Store and manage question banks',
  description: `This endpoint allows for the creation or updating of question banks in a centralized repository. It supports operations such as adding new questions, modifying existing questions, and organizing these questions into structured banks that can be used across various tests or assessments.

**Authentication:** Users need to be authenticated to interact with the question banks. Only authenticated requests will be processed, and unauthorized access attempts will result in a denial of the service.

**Permissions:** This endpoint requires administrative permissions related to question bank management. Users need specific roles or privileges to create or modify the content of question banks.

Upon receiving a request, this handler validates the user's authentication and permissions to ensure they are eligible to modify or create question banks. It then proceeds to apply the provided changes to the database, either adding new entries or updating existing ones based on the supplied data. The operation might involve various method calls within the service to handle different aspects of the question bank management, such as validation of input data, enforcement of business rules, and the actual data persistence in the database. The response to the client will confirm the successful execution of the operation or provide error messages detailing any issues encountered during the process.`,
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
