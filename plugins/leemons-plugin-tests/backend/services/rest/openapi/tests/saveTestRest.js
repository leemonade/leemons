const { schema } = require('./schemas/response/saveTestRest');
const { schema: xRequest } = require('./schemas/request/saveTestRest');

const openapi = {
  summary: 'Save a new test configuration',
  description: `This endpoint allows for the creation of a new test configuration within the system. It handles the data submission for a test's setup including details such as its structure, associated question banks, test rules, and metadata.

**Authentication:** User authentication is required to ensure that only authorized users can create test configurations. An API call without proper authentication will be rejected.

**Permissions:** Proper permissions are needed to execute this endpoint. Users must have the 'test_creation' permission to save a new test configuration in the system.

Upon receiving a request, the \`saveTestRest\` handler begins by validating the incoming data against a predefined schema to ensure that all required fields are included and properly formatted. If the validation passes, it invokes the internal method \`saveTest\`, passing in the test data. This method interacts with the database to store the new test configuration, handling any relationships with questions and question banks as necessary. After successful database operations, the method returns a confirmation of the saved test with its ID. The server then responds to the client's request with this information, indicating successful creation of the test configuration.`,
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
