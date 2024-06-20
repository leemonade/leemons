const { schema } = require('./schemas/response/saveTestRest');
const { schema: xRequest } = require('./schemas/request/saveTestRest');

const openapi = {
  summary: 'Saves a new test configuration',
  description: `This endpoint is responsible for saving a test configuration to the database. It allows the client to store all necessary details about a test including its structure, associated questions, and metadata.

**Authentication:** Users must be authenticated to save a test configuration. This action ensures that only authorized users can create or modify tests.

**Permissions:** The endpoint requires administrative or specific module-related permissions to ensure that only users with the right to create or edit tests can perform this operation.

Upon receiving the API call, the \`saveTestRest\` handler initially validates the input to ensure it contains valid and complete test details. It then utilizes the \`saveTest\` method from the core \`tests\` service. This method involves a series of processes including the validation of allowed fields, association of the test with the appropriate user context, and the insertion of the test into the database. If successful, the saved test details are returned in the response, along with a confirmation message. Error handling is implemented to catch and return any issues that might arise during the process, such as validation failures or database errors.`,
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
