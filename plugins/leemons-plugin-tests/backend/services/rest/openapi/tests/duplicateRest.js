const { schema } = require('./schemas/response/duplicateRest');
const { schema: xRequest } = require('./schemas/request/duplicateRest');

const openapi = {
  summary: 'Duplicate test items for a user',
  description: `This endpoint enables the duplication of test items based on the user's specified criteria. It is designed to streamline the test setup process by allowing users to quickly create copies of existing tests for various purposes such as different student groups, test variants, or retakes.

**Authentication:** User authentication is mandatory for this action. An attempt to access this endpoint without proper credentials will be rejected.

**Permissions:** Users must possess the 'tests.duplicate' permission to use this function. Without this permission, the request to duplicate test items will be denied.

The 'duplicateRest' handler is responsible for processing the duplication of tests. Initially, it validates the provided input parameters to ensure they meet the required format and contain all necessary information. Upon passing validation, it invokes the 'duplicate' method from the 'Tests' core service with the appropriate arguments. The 'duplicate' method takes care of the business logic for duplicating the test items which includes copying the test data and storing the new duplicates in the database. Upon successful completion, the 'duplicateRest' handler will return a response confirming the duplication, along with details of the duplicated test items.`,
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
