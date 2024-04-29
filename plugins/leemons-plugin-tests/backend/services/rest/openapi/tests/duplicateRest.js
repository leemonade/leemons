const { schema } = require('./schemas/response/duplicateRest');
const { schema: xRequest } = require('./schemas/request/duplicateRest');

const openapi = {
  summary: 'Duplicate a specific test configuration',
  description: `This endpoint allows for the duplication of a specific test configuration within the system. Cloning the details and setups of the chosen test to create a new, identical entry under a new identifier.

**Authentication:** User authentication is required to access this duplication feature. Users must be logged into their accounts to initiate the duplication process.

**Permissions:** Adequate permissions must be granted for users to be able to duplicate test configurations. Typically, this includes permissions to read and create tests within the system.

Upon receiving a request, the \`duplicateTest\` action in the \`Tests\` service is invoked with necessary parameters such as the test identifier. This action uses a method to fetch all data related to the original test from the database, then creates a new test entry by copying all fetched details. Post duplication, a new unique test ID is generated for the newly created test, ensuring no conflicts with existing entries. The flow completes with a response to the client including the details of the newly duplicated test, encapsulated within a standardized format.`,
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
